import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, Loader2, Share2 } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type z from "zod";

import LogoUploader from "@/components/logo-uploader";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { updateEstablishment } from "@/http/establishment/update-establishment";
import { maskPhone } from "@/lib/masks";
import { uploadImage } from "@/lib/upload-image";
import { slugify, themeOptions } from "@/lib/utils";
import {
  type Establishment,
  updateEstablishmentSchema,
} from "@/lib/validations/establishment";

type Inputs = z.infer<typeof updateEstablishmentSchema>;

export function UpdateStoreForm({
  establishment,
}: {
  establishment: Establishment;
}) {
  const queryClient = useQueryClient();

  const [isLoading, setIsLoading] = React.useState(false);
  const [bannerImageFile, setBannerImageFile] = React.useState<File | null>(
    null,
  );
  const [logoImageFile, setLogoImageFile] = React.useState<File | null>(null);
  const [copied, setCopied] = React.useState(false);

  const form = useForm<Inputs>({
    resolver: zodResolver(updateEstablishmentSchema),
    defaultValues: {
      id: establishment.id,
      name: establishment.name,
      slug: establishment.slug,
      about: establishment.about,
      activeCustomers: establishment.activeCustomers,
      servicesPerformed: establishment.servicesPerformed,
      experienceTime: establishment.experienceTime,
      address: establishment.address,
      googleMapsLink: establishment.googleMapsLink,
      phone: maskPhone(establishment.phone ?? ""),
      theme: establishment.theme,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: updateEstablishment,
    onSuccess: () => {
      toast.success("Alterações salvas com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["establishment"] });
      setIsLoading(false);
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || "Erro ao salvar alterações";
      toast.error(errorMessage);
      console.error(error);
      setIsLoading(false);
    },
  });

  const handleCopyLink = async () => {
    try {
      const storeUrl = `${window.location.origin}/${establishment.slug}`;
      await navigator.clipboard.writeText(storeUrl);
      setCopied(true);
      toast.success("Link da loja copiado!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Erro ao copiar link");
    }
  };

  async function onSubmit(values: Inputs) {
    setIsLoading(true);

    try {
      let logoUrl: string | undefined;
      let bannerUrl: string | undefined;

      if (logoImageFile) {
        const logoImageUrl = await uploadImage(logoImageFile);

        logoUrl = logoImageUrl;
      } else {
        logoUrl = establishment.logoUrl;
      }

      if (bannerImageFile) {
        const logoImageUrl = await uploadImage(bannerImageFile);

        bannerUrl = logoImageUrl;
      } else {
        bannerUrl = establishment.bannerUrl;
      }

      mutate({
        ...values,
        id: establishment.id,
        logoUrl: logoUrl ?? undefined,
        bannerUrl: bannerUrl ?? undefined,
      });
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || "Erro ao fazer upload das imagens";
      toast.error(errorMessage);
      console.error(error);
      setIsLoading(false);
    }
  }

  const slugState = form.watch("slug");

  React.useEffect(() => {
    form.setValue("slug", slugify(slugState ?? ""));
  }, [slugState, form]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-lg"
      >
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-4">
          <FormItem>
            <FormLabel>Logo do loja</FormLabel>
            <FormControl>
              <div className="flex justify-start">
                <LogoUploader
                  value={logoImageFile}
                  imageUrl={establishment.logoUrl ?? null}
                  onChange={setLogoImageFile}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
          <FormItem>
            <FormLabel>Banner do loja</FormLabel>
            <FormControl>
              <div className="flex justify-start">
                <LogoUploader
                  value={bannerImageFile}
                  imageUrl={establishment.bannerUrl ?? null}
                  onChange={setBannerImageFile}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        </div>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do estabelecimento</FormLabel>
              <FormControl>
                <Input placeholder="Digite aqui o nome da loja" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Link da loja</FormLabel>
              <FormControl>
                <div className="flex gap-2">
                  <Input placeholder="acme-me" {...field} />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCopyLink}
                    className="flex items-center gap-2 shrink-0"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4" />
                        Copiado!
                      </>
                    ) : (
                      <>
                        <Share2 className="h-4 w-4" />
                        Copiar link
                      </>
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="theme"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tema</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma cor" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {themeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <span
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: option.color }}
                        />
                        <span>{option.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone</FormLabel>
              <FormControl>
                <Input
                  placeholder="Digite o telefone da loja aqui"
                  {...field}
                  onChange={(e) => field.onChange(maskPhone(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="about"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sobre nós</FormLabel>
              <FormControl>
                <Textarea placeholder="Digite sobre sua loja aqui" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4">
          <FormField
            control={form.control}
            name="activeCustomers"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Clientes ativos</FormLabel>
                <FormControl>
                  <Input placeholder="+100" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="servicesPerformed"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Serviços realizados</FormLabel>
                <FormControl>
                  <Input placeholder="+500" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="experienceTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tempo de experiência</FormLabel>
                <FormControl>
                  <Input placeholder="10 anos" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="googleMapsLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Link do Google Maps</FormLabel>
              <FormControl>
                <Input
                  placeholder="Cole aqui o link do Google Maps"
                  {...field}
                />
              </FormControl>
              <p className="text-xs text-muted-foreground mt-1">
                Para obter: abra o <b>Google Maps</b>, busque pelo endereço da
                sua loja, clique em <b>Compartilhar</b> → <b>Copiar link</b> e
                cole aqui.
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Endereço da loja</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Digite o endereço da loja aqui"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending || isLoading}>
          Salvar
          {isPending || isLoading ? (
            <Loader2 className="size-4 animate-spin ml-2" />
          ) : null}
        </Button>
      </form>
    </Form>
  );
}
