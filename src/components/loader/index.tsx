'use client'

import { Skeleton } from '@/components/ui/skeleton'; // Assuming you have a Skeleton component in your UI library
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
const SkeletonLoader = () => {
  return (
    <div className="min-h-screen font-raleway">
      {/* Navbar Skeleton */}
      <nav className="border-b-2 py-4 px-6 flex justify-between items-center">
        <Skeleton className="h-8 w-48" />
        <div className="flex items-center space-x-4">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </nav>

      {/* Main Content Skeleton */}
      <div className="p-6 bg-gray-100">
        {/* Category Selection Skeleton */}
        <div className="mb-8">
          <Skeleton className="h-6 w-48 mb-4" />
          <Skeleton className="h-10 w-[180px]" />
        </div>

        {/* Analytics Section Skeleton */}
        <div className="mb-8">
          <Skeleton className="h-6 w-48 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((_, index) => (
              <Card key={index} className="shadow-lg">
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* User Activity Chart Skeleton */}
        <div className="mb-8">
          <Skeleton className="h-6 w-48 mb-4" />
          <Card className="shadow-lg">
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        </div>

        {/* Purchased Services Skeleton */}
        <div>
          <Skeleton className="h-6 w-48 mb-4" />
          <Card className="shadow-lg">
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead><Skeleton className="h-6 w-24" /></TableHead>
                    <TableHead><Skeleton className="h-6 w-24" /></TableHead>
                    <TableHead><Skeleton className="h-6 w-24" /></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[1, 2].map((_, index) => (
                    <TableRow key={index}>
                      <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoader;