import React, { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Send, CheckCircle2, AlertCircle } from "lucide-react";

export function EmailComposer() {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [templateId, setTemplateId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const { data: templates, isLoading: templatesLoading } = trpc.email.templates.list.useQuery();
  const sendEmailMutation = trpc.email.sendMassEmail.useMutation();

  const handleLoadTemplate = (id: string) => {
    const template = templates?.find((t) => t.id === parseInt(id));
    if (template) {
      setSubject(template.subject);
      setContent(template.content);
      setTemplateId(id);
    }
  };

  const handleSendEmail = async () => {
    if (!subject.trim() || !content.trim()) {
      setErrorMessage("Veuillez remplir le sujet et le contenu de l'email");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const result = await sendEmailMutation.mutateAsync({
        subject,
        content,
        templateId: templateId ? parseInt(templateId) : undefined,
      });

      if (result.success) {
        setSuccessMessage(
          `Email envoyé avec succès à ${result.successCount}/${result.totalCount} membres`
        );
        setSubject("");
        setContent("");
        setTemplateId("");
      } else {
        setErrorMessage(result.error || "Erreur lors de l'envoi de l'email");
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Erreur lors de l'envoi de l'email"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Composer un Email</h1>
        <p className="text-muted-foreground">
          Envoyez des emails à tous les membres de l'association
        </p>
      </div>

      <div className="grid gap-6">
        {/* Templates Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Modèles d'Email</CardTitle>
            <CardDescription>
              Choisissez un modèle existant ou créez un nouvel email
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={templateId} onValueChange={handleLoadTemplate}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un modèle..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Créer un nouvel email</SelectItem>
                {templates?.map((template) => (
                  <SelectItem key={template.id} value={template.id.toString()}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Email Composer Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Contenu de l'Email</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Subject */}
            <div>
              <label className="block text-sm font-medium mb-2">Sujet</label>
              <Input
                placeholder="Entrez le sujet de l'email"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                disabled={isLoading}
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium mb-2">Contenu</label>
              <Textarea
                placeholder="Entrez le contenu de l'email"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={isLoading}
                rows={10}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Vous pouvez utiliser du texte brut ou du HTML
              </p>
            </div>

            {/* Preview */}
            {subject || content ? (
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Aperçu</h3>
                <div className="bg-background p-3 rounded border">
                  {subject && <p className="font-bold mb-2">{subject}</p>}
                  <p className="text-sm whitespace-pre-wrap">{content}</p>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>

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

        {/* Send Button */}
        <div className="flex gap-2">
          <Button
            onClick={handleSendEmail}
            disabled={isLoading || !subject.trim() || !content.trim()}
            className="w-full sm:w-auto"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Envoi en cours...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Envoyer l'Email
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setSubject("");
              setContent("");
              setTemplateId("");
              setSuccessMessage("");
              setErrorMessage("");
            }}
            disabled={isLoading}
          >
            Réinitialiser
          </Button>
        </div>

        {/* Info Box */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <p className="text-sm text-blue-900">
              <strong>ℹ️ Information:</strong> Les emails seront envoyés à tous les membres actifs
              de l'association. Chaque envoi est enregistré dans l'historique pour suivi.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default EmailComposer;
