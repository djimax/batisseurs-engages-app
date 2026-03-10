import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { HeroSection } from "@/components/HeroSection";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Mail,
  Phone,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Download,
} from "lucide-react";
import { exportContactsToCSV, exportContactsToExcel, generateExportFilename } from "@/lib/exportContacts";

const SEGMENT_OPTIONS = [
  { value: "prospect", label: "Prospect" },
  { value: "member", label: "Membre" },
  { value: "donor", label: "Donateur" },
  { value: "volunteer", label: "Bénévole" },
  { value: "partner", label: "Partenaire" },
];

const STATUS_OPTIONS = [
  { value: "prospect", label: "Prospect" },
  { value: "active", label: "Actif" },
  { value: "inactive", label: "Inactif" },
  { value: "archived", label: "Archivé" },
];

export default function CRMContacts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSegment, setSelectedSegment] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<any>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Form states
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    segment: "general",
    status: "prospect" as "prospect" | "active" | "inactive" | "archived",
    notes: "",
  });

  const { data: contacts, isLoading, refetch } = trpc.crm.contacts.list.useQuery();
  const createContactMutation = trpc.crm.contacts.create.useMutation();
  const updateContactMutation = trpc.crm.contacts.update.useMutation();
  const deleteContactMutation = trpc.crm.contacts.delete.useMutation();

  // Filter contacts
  const filteredContacts = contacts?.filter((contact) => {
    const matchesSearch =
      contact.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);

    const matchesSegment = !selectedSegment || contact.segment === selectedSegment;
    const matchesStatus = !selectedStatus || contact.status === selectedStatus;

    return matchesSearch && matchesSegment && matchesStatus;
  });

  const handleAddContact = async () => {
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email?.trim()) {
      setErrorMessage("Veuillez remplir les champs obligatoires (Prénom, Nom, Email)");
      return;
    }

    try {
      await createContactMutation.mutateAsync({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone || undefined,
        company: formData.company || undefined,
        segment: formData.segment,
        status: formData.status,
        notes: formData.notes || undefined,
        createdBy: 1,
      });

      setSuccessMessage("Contact ajouté avec succès");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        company: "",
        segment: "general",
        status: "prospect",
        notes: "",
      });
      setIsAddDialogOpen(false);
      refetch();

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Erreur lors de l'ajout du contact"
      );
    }
  };

  const handleEditContact = async () => {
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email?.trim()) {
      setErrorMessage("Veuillez remplir les champs obligatoires");
      return;
    }

    try {
      await updateContactMutation.mutateAsync({
        id: editingContact.id,
        data: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone || undefined,
          company: formData.company || undefined,
          segment: formData.segment,
          status: formData.status,
          notes: formData.notes || undefined,
        },
      });

      setSuccessMessage("Contact modifié avec succès");
      setIsEditDialogOpen(false);
      setEditingContact(null);
      refetch();

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Erreur lors de la modification du contact"
      );
    }
  };

  const handleDeleteContact = async (contactId: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce contact ?")) return;

    try {
      await deleteContactMutation.mutateAsync(contactId);
      setSuccessMessage("Contact supprimé avec succès");
      refetch();

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Erreur lors de la suppression du contact"
      );
    }
  };

  const openEditDialog = (contact: any) => {
    setEditingContact(contact);
    setFormData({
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email || "",
      phone: contact.phone || "",
      company: contact.company || "",
      segment: contact.segment,
      status: contact.status,
      notes: contact.notes || "",
    });
    setIsEditDialogOpen(true);
  };

  return (
    <div className="space-y-8">
      <HeroSection
        title="Gestion des Contacts CRM"
        subtitle="Gérez vos contacts, prospects et partenaires"
        variant="secondary"
      />

      <div className="container mx-auto px-4 max-w-7xl space-y-6">
        {/* Messages */}
        {successMessage && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
          </Alert>
        )}

        {errorMessage && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{errorMessage}</AlertDescription>
          </Alert>
        )}

        {/* Header with Add Button */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Contacts</h1>
            <p className="text-muted-foreground mt-1">
              {filteredContacts?.length || 0} contact(s) trouvé(s)
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Export Buttons */}
            {filteredContacts && filteredContacts.length > 0 && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const filename = generateExportFilename("csv");
                    exportContactsToCSV(filteredContacts as any, filename);
                    setSuccessMessage("Contacts exportés en CSV");
                    setTimeout(() => setSuccessMessage(""), 3000);
                  }}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  CSV
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    const filename = generateExportFilename("xlsx");
                    await exportContactsToExcel(filteredContacts as any, filename);
                    setSuccessMessage("Contacts exportés en Excel");
                    setTimeout(() => setSuccessMessage(""), 3000);
                  }}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Excel
                </Button>
              </>
            )}

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Ajouter un Contact
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Ajouter un Nouveau Contact</DialogTitle>
                <DialogDescription>
                  Remplissez les informations du contact
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Prénom *</label>
                    <Input
                      placeholder="Jean"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Nom *</label>
                    <Input
                      placeholder="Dupont"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Email *</label>
                  <Input
                    type="email"
                    placeholder="jean@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Téléphone</label>
                  <Input
                    placeholder="+33 6 12 34 56 78"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Entreprise</label>
                  <Input
                    placeholder="Acme Corp"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Segment</label>
                    <Select value={formData.segment} onValueChange={(value) =>
                      setFormData({ ...formData, segment: value })
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SEGMENT_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Statut</label>
                    <Select value={formData.status} onValueChange={(value) =>
                      setFormData({ ...formData, status: value as "prospect" | "active" | "inactive" | "archived" })
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Notes</label>
                  <Input
                    placeholder="Notes supplémentaires..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>

                <Button
                  onClick={handleAddContact}
                  disabled={createContactMutation.isPending}
                  className="w-full"
                >
                  {createContactMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Ajout en cours...
                    </>
                  ) : (
                    "Ajouter le Contact"
                  )}
                </Button>
              </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Rechercher</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Nom, email..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Segment</label>
                <Select value={selectedSegment || "all"} onValueChange={(value) => setSelectedSegment(value === "all" ? "" : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les segments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les segments</SelectItem>
                    {SEGMENT_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Statut</label>
                <Select value={selectedStatus || "all"} onValueChange={(value) => setSelectedStatus(value === "all" ? "" : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les statuts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    {STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contacts Table */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des Contacts</CardTitle>
            <CardDescription>
              Gérez vos contacts, prospects et partenaires
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : filteredContacts && filteredContacts.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Téléphone</TableHead>
                      <TableHead>Segment</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredContacts.map((contact) => (
                      <TableRow key={contact.id}>
                        <TableCell className="font-medium">
                          {contact.firstName} {contact.lastName}
                        </TableCell>
                        <TableCell>
                          {contact.email ? (
                            <a
                              href={`mailto:${contact.email}`}
                              className="flex items-center gap-2 text-blue-600 hover:underline"
                            >
                              <Mail className="h-4 w-4" />
                              {contact.email}
                            </a>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {contact.phone ? (
                            <a
                              href={`tel:${contact.phone}`}
                              className="flex items-center gap-2 text-blue-600 hover:underline"
                            >
                              <Phone className="h-4 w-4" />
                              {contact.phone}
                            </a>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {SEGMENT_OPTIONS.find((s) => s.value === contact.segment)?.label || contact.segment}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              contact.status === "active"
                                ? "default"
                                : contact.status === "inactive"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {STATUS_OPTIONS.find((s) => s.value === contact.status)?.label || contact.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditDialog(contact)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteContact(contact.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Aucun contact trouvé</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Modifier le Contact</DialogTitle>
            <DialogDescription>
              Mettez à jour les informations du contact
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Prénom</label>
                <Input
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Nom</label>
                <Input
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Téléphone</label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Entreprise</label>
              <Input
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Segment</label>
                <Select value={formData.segment} onValueChange={(value) =>
                  setFormData({ ...formData, segment: value })
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SEGMENT_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Statut</label>
                <Select value={formData.status} onValueChange={(value) =>
                  setFormData({ ...formData, status: value as "prospect" | "active" | "inactive" | "archived" })
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Notes</label>
              <Input
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>

            <Button
              onClick={handleEditContact}
              disabled={updateContactMutation.isPending}
              className="w-full"
            >
              {updateContactMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Modification en cours...
                </>
              ) : (
                "Modifier le Contact"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
