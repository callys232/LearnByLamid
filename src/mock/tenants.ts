import type { Tenant, ServiceCategory } from "@/types/types";

export const mockServiceCategories: ServiceCategory[] = [
  {
    id: "cat-hcd",
    tenantId: "tenant-lamid",
    label: "Human-Centered Design",
    code: "HCD",
    color: "#C12129",
    description: "Design thinking, UX research, product design",
  },
  {
    id: "cat-biz",
    tenantId: "tenant-lamid",
    label: "Business Strategy",
    code: "BIZ",
    color: "#E8A020",
    description: "Entrepreneurship, operations, growth strategy",
  },
  {
    id: "cat-sd",
    tenantId: "tenant-lamid",
    label: "Software Development",
    code: "SD",
    color: "#2563EB",
    description: "Engineering, web dev, systems design",
  },
];

export const mockTenants: Tenant[] = [
  {
    id: "tenant-lamid",
    name: "LAMID",
    slug: "lamid",
    type: "lamid",
    primaryColor: "#C12129",
    domain: "learn.lamid.co",
    serviceCategories: mockServiceCategories,
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "tenant-acme",
    name: "Acme Academy",
    slug: "acme",
    type: "enterprise",
    primaryColor: "#2563EB",
    domain: "academy.acme.com",
    serviceCategories: [
      {
        id: "cat-pm",
        tenantId: "tenant-acme",
        label: "Product Management",
        code: "PM",
        color: "#2563EB",
      },
      {
        id: "cat-data",
        tenantId: "tenant-acme",
        label: "Data & Analytics",
        code: "DATA",
        color: "#059669",
      },
    ],
    createdAt: "2024-06-01T00:00:00Z",
  },
];
