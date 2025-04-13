"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
const skeleton_1 = require("@/components/ui/skeleton"); // Assuming you have a Skeleton component in your UI library
const card_1 = require("@/components/ui/card");
const table_1 = require("@/components/ui/table");
const SkeletonLoader = () => {
    return (<div className="min-h-screen font-raleway">
      {/* Navbar Skeleton */}
      <nav className="border-b-2 py-4 px-6 flex justify-between items-center">
        <skeleton_1.Skeleton className="h-8 w-48"/>
        <div className="flex items-center space-x-4">
          <skeleton_1.Skeleton className="h-6 w-24"/>
          <skeleton_1.Skeleton className="h-10 w-10 rounded-full"/>
        </div>
      </nav>

      {/* Main Content Skeleton */}
      <div className="p-6 bg-gray-100">
        {/* Category Selection Skeleton */}
        <div className="mb-8">
          <skeleton_1.Skeleton className="h-6 w-48 mb-4"/>
          <skeleton_1.Skeleton className="h-10 w-[180px]"/>
        </div>

        {/* Analytics Section Skeleton */}
        <div className="mb-8">
          <skeleton_1.Skeleton className="h-6 w-48 mb-4"/>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((_, index) => (<card_1.Card key={index} className="shadow-lg">
                <card_1.CardHeader>
                  <skeleton_1.Skeleton className="h-6 w-32"/>
                  <skeleton_1.Skeleton className="h-4 w-24"/>
                </card_1.CardHeader>
                <card_1.CardContent>
                  <skeleton_1.Skeleton className="h-8 w-16"/>
                </card_1.CardContent>
              </card_1.Card>))}
          </div>
        </div>

        {/* User Activity Chart Skeleton */}
        <div className="mb-8">
          <skeleton_1.Skeleton className="h-6 w-48 mb-4"/>
          <card_1.Card className="shadow-lg">
            <card_1.CardHeader>
              <skeleton_1.Skeleton className="h-6 w-48"/>
              <skeleton_1.Skeleton className="h-4 w-64"/>
            </card_1.CardHeader>
            <card_1.CardContent>
              <skeleton_1.Skeleton className="h-64 w-full"/>
            </card_1.CardContent>
          </card_1.Card>
        </div>

        {/* Purchased Services Skeleton */}
        <div>
          <skeleton_1.Skeleton className="h-6 w-48 mb-4"/>
          <card_1.Card className="shadow-lg">
            <card_1.CardHeader>
              <skeleton_1.Skeleton className="h-6 w-48"/>
              <skeleton_1.Skeleton className="h-4 w-64"/>
            </card_1.CardHeader>
            <card_1.CardContent>
              <table_1.Table>
                <table_1.TableHeader>
                  <table_1.TableRow>
                    <table_1.TableHead><skeleton_1.Skeleton className="h-6 w-24"/></table_1.TableHead>
                    <table_1.TableHead><skeleton_1.Skeleton className="h-6 w-24"/></table_1.TableHead>
                    <table_1.TableHead><skeleton_1.Skeleton className="h-6 w-24"/></table_1.TableHead>
                  </table_1.TableRow>
                </table_1.TableHeader>
                <table_1.TableBody>
                  {[1, 2].map((_, index) => (<table_1.TableRow key={index}>
                      <table_1.TableCell><skeleton_1.Skeleton className="h-6 w-32"/></table_1.TableCell>
                      <table_1.TableCell><skeleton_1.Skeleton className="h-6 w-24"/></table_1.TableCell>
                      <table_1.TableCell><skeleton_1.Skeleton className="h-6 w-16"/></table_1.TableCell>
                    </table_1.TableRow>))}
                </table_1.TableBody>
              </table_1.Table>
            </card_1.CardContent>
          </card_1.Card>
        </div>
      </div>
    </div>);
};
exports.default = SkeletonLoader;
