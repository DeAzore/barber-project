import AdminLayout from "@/layouts/AdminLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BusinessSettingsForm from "@/components/dashboard/settings/BusinessSettingsForm";
import AccountSettingsForm from "@/components/dashboard/settings/AccountSettingsForm";

export default function SettingsPage() {
  return (
    <AdminLayout>
      <div>
        <h1 className="text-2xl font-bold text-cabbelero-gold mb-6">Paramètres</h1>
        
        <Tabs defaultValue="business" className="space-y-4">
          <TabsList className="bg-cabbelero-gray">
            <TabsTrigger value="business">Entreprise</TabsTrigger>
            <TabsTrigger value="account">Compte</TabsTrigger>
          </TabsList>
          
          <TabsContent value="business">
            <BusinessSettingsForm />
          </TabsContent>
          
          <TabsContent value="account">
            <AccountSettingsForm />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
