-- Fix Orders RLS Policies
CREATE POLICY "Clients can insert orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = client_id);
CREATE POLICY "Users can update own orders" ON public.orders FOR UPDATE USING (auth.uid() = client_id OR auth.uid() = creator_id);
