import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart3, TrendingUp, TrendingDown, Users, ShoppingCart, 
  Package, Calendar, Download, ArrowRight, DollarSign, CreditCard
} from 'lucide-react';
import { useLocation } from 'wouter';
import { apiRequest } from '@/lib/queryClient';

interface ReportData {
  sales: {
    total: number;
    count: number;
    byDate: Array<{ date: string; amount: number; count: number }>;
    byCategory: Array<{ category: string; amount: number; count: number }>;
  };
  inventory: {
    totalValue: number;
    lowStock: number;
    outOfStock: number;
    byCategory: Array<{ category: string; count: number; value: number }>;
  };
  customers: {
    total: number;
    new: number;
    active: number;
    byMonth: Array<{ month: string; count: number }>;
  };
  memberships: {
    active: number;
    totalSessions: number;
    usedSessions: number;
    byType: Array<{ type: string; count: number; sessions: number }>;
  };
}

export default function Reports() {
  const [, setLocation] = useLocation();
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'year' | 'all'>('month');
  const [activeTab, setActiveTab] = useState<'sales' | 'inventory' | 'customers' | 'memberships'>('sales');

  const { data: transactions } = useQuery({
    queryKey: ['/api/transactions'],
  });

  const { data: customers } = useQuery({
    queryKey: ['/api/customers'],
  });

  const { data: products } = useQuery({
    queryKey: ['/api/products'],
  });

  const { data: memberships } = useQuery({
    queryKey: ['/api/memberships'],
  });

  const transactionsList = Array.isArray(transactions) 
    ? transactions 
    : (transactions as any)?.data ?? [];

  const customersList = Array.isArray(customers) 
    ? customers 
    : (customers as any)?.data ?? [];

  const productsList = Array.isArray(products) 
    ? products 
    : (products as any)?.data ?? [];

  const membershipsList = Array.isArray(memberships) 
    ? memberships 
    : (memberships as any)?.data ?? [];

  // Calculate sales report
  const calculateSalesReport = () => {
    const now = new Date();
    let startDate: Date;
    
    switch (dateRange) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(0);
    }

    const filtered = transactionsList.filter((t: any) => {
      if (!t.createdAt) return false;
      const tDate = new Date(t.createdAt);
      return tDate >= startDate && t.status === 'completed';
    });

    const total = filtered.reduce((sum: number, t: any) => sum + parseFloat(t.amount || 0), 0);
    
    const byDate: Record<string, { amount: number; count: number }> = {};
    filtered.forEach((t: any) => {
      const date = new Date(t.createdAt).toLocaleDateString('he-IL');
      if (!byDate[date]) {
        byDate[date] = { amount: 0, count: 0 };
      }
      byDate[date].amount += parseFloat(t.amount || 0);
      byDate[date].count += 1;
    });

    const byCategory: Record<string, { amount: number; count: number }> = {};
    filtered.forEach((t: any) => {
      const category = t.metadata?.category || t.type || 'אחר';
      if (!byCategory[category]) {
        byCategory[category] = { amount: 0, count: 0 };
      }
      byCategory[category].amount += parseFloat(t.amount || 0);
      byCategory[category].count += 1;
    });

    return {
      total,
      count: filtered.length,
      byDate: Object.entries(byDate).map(([date, data]) => ({ date, ...data })),
      byCategory: Object.entries(byCategory).map(([category, data]) => ({ category, ...data })),
    };
  };

  // Calculate inventory report
  const calculateInventoryReport = () => {
    const productItems = productsList.filter((p: any) => p.productType === 'product');
    const totalValue = productItems.reduce((sum: number, p: any) => 
      sum + (parseFloat(p.price || 0) * (p.stock || 0)), 0);
    
    const lowStock = productItems.filter((p: any) => p.stock > 0 && p.stock < 5).length;
    const outOfStock = productItems.filter((p: any) => p.stock === 0).length;

    const byCategory: Record<string, { count: number; value: number }> = {};
    productItems.forEach((p: any) => {
      const category = p.category || 'אחר';
      if (!byCategory[category]) {
        byCategory[category] = { count: 0, value: 0 };
      }
      byCategory[category].count += 1;
      byCategory[category].value += parseFloat(p.price || 0) * (p.stock || 0);
    });

    return {
      totalValue,
      lowStock,
      outOfStock,
      byCategory: Object.entries(byCategory).map(([category, data]) => ({ category, ...data })),
    };
  };

  // Calculate customers report
  const calculateCustomersReport = () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const newCustomers = customersList.filter((c: any) => {
      if (!c.createdAt) return false;
      return new Date(c.createdAt) >= startOfMonth;
    }).length;

    const activeCustomers = customersList.filter((c: any) => {
      // Customers with active memberships or recent transactions
      return true; // Simplified
    }).length;

    return {
      total: customersList.length,
      new: newCustomers,
      active: activeCustomers,
      byMonth: [], // Can be calculated if needed
    };
  };

  // Calculate memberships report
  const calculateMembershipsReport = () => {
    const active = membershipsList.filter((m: any) => m.isActive && m.balance > 0);
    const totalSessions = membershipsList.reduce((sum: number, m: any) => sum + (m.totalPurchased || 0), 0);
    const usedSessions = membershipsList.reduce((sum: number, m: any) => 
      sum + ((m.totalPurchased || 0) - (m.balance || 0)), 0);

    const byType: Record<string, { count: number; sessions: number }> = {};
    membershipsList.forEach((m: any) => {
      const type = m.type || 'אחר';
      if (!byType[type]) {
        byType[type] = { count: 0, sessions: 0 };
      }
      byType[type].count += 1;
      byType[type].sessions += m.totalPurchased || 0;
    });

    return {
      active: active.length,
      totalSessions,
      usedSessions,
      byType: Object.entries(byType).map(([type, data]) => ({ type, ...data })),
    };
  };

  const salesReport = calculateSalesReport();
  const inventoryReport = calculateInventoryReport();
  const customersReport = calculateCustomersReport();
  const membershipsReport = calculateMembershipsReport();

  const handleExport = (type: string) => {
    // Export functionality - can be implemented with CSV/Excel export
    console.log(`Exporting ${type} report...`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6" dir="rtl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setLocation('/')}
              variant="outline"
              size="icon"
            >
              <ArrowRight className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                דוחות וניתוחים
              </h1>
              <p className="text-slate-400 mt-2">
                דוחות מפורטים על מכירות, מלאי, לקוחות וכרטיסיות
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Select value={dateRange} onValueChange={(v: any) => setDateRange(v)}>
              <SelectTrigger className="w-[150px] bg-slate-700/50 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">היום</SelectItem>
                <SelectItem value="week">שבוע אחרון</SelectItem>
                <SelectItem value="month">חודש אחרון</SelectItem>
                <SelectItem value="year">שנה אחרונה</SelectItem>
                <SelectItem value="all">הכל</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => handleExport(activeTab)}
              className="border-slate-600"
            >
              <Download className="w-4 h-4 ml-2" />
              ייצא
            </Button>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)}>
        <TabsList className="bg-slate-800/50 border-slate-700 mb-6">
          <TabsTrigger value="sales" className="data-[state=active]:bg-pink-500">
            <ShoppingCart className="w-4 h-4 ml-2" />
            מכירות
          </TabsTrigger>
          <TabsTrigger value="inventory" className="data-[state=active]:bg-pink-500">
            <Package className="w-4 h-4 ml-2" />
            מלאי
          </TabsTrigger>
          <TabsTrigger value="customers" className="data-[state=active]:bg-pink-500">
            <Users className="w-4 h-4 ml-2" />
            לקוחות
          </TabsTrigger>
          <TabsTrigger value="memberships" className="data-[state=active]:bg-pink-500">
            <CreditCard className="w-4 h-4 ml-2" />
            כרטיסיות
          </TabsTrigger>
        </TabsList>

        {/* Sales Report */}
        <TabsContent value="sales">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">סה"כ מכירות</p>
                    <p className="text-2xl font-bold text-white">₪{salesReport.total.toFixed(2)}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-400" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">מספר עסקאות</p>
                    <p className="text-2xl font-bold text-white">{salesReport.count}</p>
                  </div>
                  <ShoppingCart className="w-8 h-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">ממוצע לעסקה</p>
                    <p className="text-2xl font-bold text-white">
                      ₪{salesReport.count > 0 ? (salesReport.total / salesReport.count).toFixed(2) : '0.00'}
                    </p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-purple-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle>מכירות לפי קטגוריה</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {salesReport.byCategory.map((item) => (
                    <div key={item.category} className="flex items-center justify-between p-3 bg-slate-700/30 rounded">
                      <span className="text-white">{item.category}</span>
                      <div className="text-left">
                        <p className="text-white font-bold">₪{item.amount.toFixed(2)}</p>
                        <p className="text-slate-400 text-sm">{item.count} עסקאות</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle>מכירות לפי תאריך</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {salesReport.byDate.map((item) => (
                    <div key={item.date} className="flex items-center justify-between p-3 bg-slate-700/30 rounded">
                      <span className="text-white">{item.date}</span>
                      <div className="text-left">
                        <p className="text-white font-bold">₪{item.amount.toFixed(2)}</p>
                        <p className="text-slate-400 text-sm">{item.count} עסקאות</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Inventory Report */}
        <TabsContent value="inventory">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">ערך מלאי כולל</p>
                    <p className="text-2xl font-bold text-white">₪{inventoryReport.totalValue.toFixed(0)}</p>
                  </div>
                  <Package className="w-8 h-8 text-green-400" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">מלאי נמוך</p>
                    <p className="text-2xl font-bold text-yellow-400">{inventoryReport.lowStock}</p>
                  </div>
                  <TrendingDown className="w-8 h-8 text-yellow-400" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">אזל מהמלאי</p>
                    <p className="text-2xl font-bold text-red-400">{inventoryReport.outOfStock}</p>
                  </div>
                  <TrendingDown className="w-8 h-8 text-red-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle>מלאי לפי קטגוריה</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {inventoryReport.byCategory.map((item) => (
                  <div key={item.category} className="flex items-center justify-between p-3 bg-slate-700/30 rounded">
                    <span className="text-white">{item.category}</span>
                    <div className="text-left">
                      <p className="text-white font-bold">{item.count} מוצרים</p>
                      <p className="text-slate-400 text-sm">₪{item.value.toFixed(0)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Customers Report */}
        <TabsContent value="customers">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">סה"כ לקוחות</p>
                    <p className="text-2xl font-bold text-white">{customersReport.total}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">לקוחות חדשים</p>
                    <p className="text-2xl font-bold text-green-400">{customersReport.new}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-400" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">לקוחות פעילים</p>
                    <p className="text-2xl font-bold text-purple-400">{customersReport.active}</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-purple-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Memberships Report */}
        <TabsContent value="memberships">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">כרטיסיות פעילות</p>
                    <p className="text-2xl font-bold text-white">{membershipsReport.active}</p>
                  </div>
                  <CreditCard className="w-8 h-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">סה"כ כניסות</p>
                    <p className="text-2xl font-bold text-white">{membershipsReport.totalSessions}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-green-400" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">כניסות משומשות</p>
                    <p className="text-2xl font-bold text-yellow-400">{membershipsReport.usedSessions}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-yellow-400" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">כניסות נותרות</p>
                    <p className="text-2xl font-bold text-purple-400">
                      {membershipsReport.totalSessions - membershipsReport.usedSessions}
                    </p>
                  </div>
                  <TrendingDown className="w-8 h-8 text-purple-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle>כרטיסיות לפי סוג</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {membershipsReport.byType.map((item) => (
                  <div key={item.type} className="flex items-center justify-between p-3 bg-slate-700/30 rounded">
                    <span className="text-white">{item.type}</span>
                    <div className="text-left">
                      <p className="text-white font-bold">{item.count} כרטיסיות</p>
                      <p className="text-slate-400 text-sm">{item.sessions} כניסות</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

