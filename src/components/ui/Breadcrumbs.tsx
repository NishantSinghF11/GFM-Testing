"use client";

import Link from 'next/link';
import React from 'react';

interface BreadcrumbItem {
  name: string;
  item: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" style={{ marginBottom: '24px' }}>
      <ol style={{ 
        display: 'flex', 
        alignItems: 'center', 
        listStyle: 'none', 
        padding: 0, 
        margin: 0,
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        {items.map((item, index) => (
          <li key={index} style={{ display: 'flex', alignItems: 'center' }}>
            {index > 0 && (
              <span style={{ 
                margin: '0 10px', 
                opacity: 0.3, 
                fontSize: '10px',
                color: '#9CA3AF'
              }}>
                <i className="fa-solid fa-chevron-right"></i>
              </span>
            )}
            
            {index === items.length - 1 ? (
              <span style={{ 
                color: 'white', 
                fontWeight: 600, 
                fontSize: '0.85rem',
                opacity: 0.9,
                maxWidth: '200px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }} aria-current="page">
                {item.name}
              </span>
            ) : (
              <Link 
                href={item.item}
                style={{ 
                  color: '#9CA3AF', 
                  textDecoration: 'none', 
                  fontSize: '0.85rem',
                  transition: 'color 0.2s',
                  fontWeight: 500
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#818cf8'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#9CA3AF'}
              >
                {item.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
