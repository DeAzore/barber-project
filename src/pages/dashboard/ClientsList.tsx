import React, { useState, useEffect } from "react";
import AdminLayout from "@/layouts/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Search } from "lucide-react";

type Client = {
  id: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  total_bookings: number;
  last_booking_date: string | null;
};

export default function ClientsList() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchClients();
  }, [filter]);

  async function fetchClients() {
    setLoading(true);
    try {
      // This would typically use a custom RPC function like 'get-clients'
      // For now, we'll simulate fetching clients from the bookings table
      const { data, error } = await supabase
        .from('bookings')
        .select('client_name, client_email, client_phone, booking_date')
        .order('booking_date', { ascending: false });

      if (error) throw error;

      // Process data to create unique client entries with booking counts
      const clientMap = new Map<string, Client>();
      
      data.forEach(booking => {
        const email = booking.client_email;
        if (!clientMap.has(email)) {
          clientMap.set(email, {
            id: Math.random().toString(36).substring(2, 12),
            client_name: booking.client_name,
            client_email: booking.client_email,
            client_phone: booking.client_phone,
            total_bookings: 1,
            last_booking_date: booking.booking_date
          });
        } else {
          const client = clientMap.get(email)!;
          client.total_bookings += 1;
          if (new Date(booking.booking_date) > new Date(client.last_booking_date || '')) {
            client.last_booking_date = booking.booking_date;
          }
        }
      });

      setClients(Array.from(clientMap.values()));
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les clients",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  // Filter clients based on search term
  const filteredClients = clients.filter(client => 
    client.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.client_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.client_phone.includes(searchTerm)
  );

  function formatDate(dateString: string | null) {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      return "Date invalide";
    }
  }

  return (
    <AdminLayout>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-cabbelero-gold">Clients</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-cabbelero-gold/70" />
              <Input
                placeholder="Rechercher un client..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-cabbelero-gray border-cabbelero-gold/20 w-64"
              />
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[180px] bg-cabbelero-gray border-cabbelero-gold/20">
                <SelectValue placeholder="Filtrer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les clients</SelectItem>
                <SelectItem value="active">Clients actifs</SelectItem>
                <SelectItem value="new">Nouveaux clients</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              className="border-cabbelero-gold text-cabbelero-gold hover:bg-cabbelero-gold hover:text-cabbelero-black"
              onClick={() => fetchClients()}
            >
              Rafraîchir
            </Button>
          </div>
        </div>

        <Card className="bg-cabbelero-gray border-cabbelero-gold/20">
          <CardHeader>
            <CardTitle>Liste des clients</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center my-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cabbelero-gold"></div>
              </div>
            ) : filteredClients.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-cabbelero-light opacity-70">Aucun client trouvé</p>
              </div>
            ) : (
              <div className="rounded-md border border-cabbelero-gold/20 overflow-hidden">
                <Table>
                  <TableHeader className="bg-cabbelero-black">
                    <TableRow>
                      <TableHead className="text-cabbelero-light">Nom</TableHead>
                      <TableHead className="text-cabbelero-light">Email</TableHead>
                      <TableHead className="text-cabbelero-light">Téléphone</TableHead>
                      <TableHead className="text-cabbelero-light">Rendez-vous</TableHead>
                      <TableHead className="text-cabbelero-light">Dernier rendez-vous</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClients.map((client) => (
                      <TableRow key={client.id} className="border-cabbelero-gray/20">
                        <TableCell className="font-medium text-cabbelero-light">
                          {client.client_name}
                        </TableCell>
                        <TableCell className="text-cabbelero-light">
                          {client.client_email}
                        </TableCell>
                        <TableCell className="text-cabbelero-light">
                          {client.client_phone}
                        </TableCell>
                        <TableCell className="text-cabbelero-light">
                          {client.total_bookings}
                        </TableCell>
                        <TableCell className="text-cabbelero-light">
                          {formatDate(client.last_booking_date)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
