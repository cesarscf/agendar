import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Edit, Trash2 } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { deleteCategory } from "@/http/categories/delete-category";
import { getCategories } from "@/http/categories/get-categories";
import { CreateCategoryForm } from "./-components/create-category-form";
import { UpdateCategoryForm } from "./-components/update-category-form";

export const Route = createFileRoute("/app/categories/")({
  component: Categories,
});

function Categories() {
  const [selectedCategoryId, setSelectedCategoryId] = React.useState<
    string | null
  >(null);
  const [showCreateCategory, setShowCreateCategory] = React.useState(false);
  const [showEditCategory, setShowEditCategory] = React.useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const { mutateAsync: deleteCategoryMutate, isPending: deleteIsPending } =
    useMutation({
      mutationFn: deleteCategory,
    });

  if (isLoading) return null;

  return (
    <div className="p-6">
      <div className="flex flex-row justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Categorias</h1>
          <p className="text-muted-foreground">
            Gerencie todas as suas categorias de serviços
          </p>
        </div>

        <Dialog open={showCreateCategory} onOpenChange={setShowCreateCategory}>
          <DialogTrigger asChild>
            <Button size="sm" className="w-fit md:w-auto">
              Adicionar
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Adicionar Categoria</DialogTitle>
            </DialogHeader>
            <CreateCategoryForm
              onSuccess={() => {
                setShowCreateCategory(false);
                refetch();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.map((category) => (
          <Card key={category.id} className="p-3">
            <CardHeader className="flex flex-row justify-between items-center p-3">
              <CardTitle className="text-lg font-medium">
                {category.name}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Dialog
                  open={showEditCategory && selectedCategoryId === category.id}
                  onOpenChange={(open) => {
                    setSelectedCategoryId(open ? category.id : null);
                    setShowEditCategory(open);
                  }}
                >
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Editar Categoria</DialogTitle>
                    </DialogHeader>
                    <UpdateCategoryForm
                      category={category}
                      onSuccess={() => {
                        setShowEditCategory(false);
                        refetch();
                      }}
                    />
                  </DialogContent>
                </Dialog>

                <Button
                  variant="ghost"
                  size="icon"
                  disabled={deleteIsPending}
                  onClick={async () => {
                    if (
                      confirm(
                        `Tem certeza que deseja excluir "${category.name}"?`,
                      )
                    ) {
                      await deleteCategoryMutate(category.id);
                    }
                  }}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
