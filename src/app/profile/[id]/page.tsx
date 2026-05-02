import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import ProfileClient from './ProfileClient';
import JsonLd from '@/components/seo/JsonLd';
import { constructMetadata } from '@/lib/seo/meta';
import { SCHEMA } from '@/lib/seo/schema';
import { getCanonicalUrl, getAbsoluteImageUrl } from '@/lib/seo/canonical';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

interface ProfilePageProps {
  params: Promise<{ id: string }>;
}

async function getProfileData(id: string) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  const isOwnProfile = user?.id === id;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();
    
  if (!profile) return null;

  const { data: gigs } = await supabase
    .from('gigs')
    .select('*')
    .eq('creator_id', id);

  const { data: blogs } = await supabase
    .from('blogs')
    .select('*')
    .eq('author_id', id)
    .eq('published', true)
    .order('created_at', { ascending: false });

  return { profile, gigs: gigs || [], blogs: blogs || [], isOwnProfile };
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const data = await getProfileData(resolvedParams.id);

  if (!data) return constructMetadata({ title: 'Profile Not Found' });

  const { profile } = data;
  
  return constructMetadata({
    title: `${profile.name} | GigsForMe Creator`,
    description: profile.bio?.substring(0, 160),
    image: getAbsoluteImageUrl(profile.avatar_url),
    canonical: getCanonicalUrl(`/profile/${profile.id}`),
    type: 'profile',
  });
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const resolvedParams = await params;
  const data = await getProfileData(resolvedParams.id);

  if (!data) notFound();

  const { profile, gigs, blogs, isOwnProfile } = data;

  const personSchema = SCHEMA.person(profile);
  const breadcrumbItems = [
    { name: 'Home', item: '/' },
    { name: 'Explore', item: '/explore' },
    { name: profile.name, item: `/profile/${profile.id}` }
  ];
  const breadcrumbSchema = SCHEMA.breadcrumb(breadcrumbItems);

  return (
    <>
      <JsonLd data={personSchema} />
      <JsonLd data={breadcrumbSchema} />
      <ProfileClient 
        creator={profile} 
        creatorGigs={gigs} 
        creatorBlogs={blogs}
        isOwnProfile={isOwnProfile} 
        breadcrumbItems={breadcrumbItems}
      />
    </>
  );
}
