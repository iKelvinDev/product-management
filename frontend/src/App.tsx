import { useEffect, useState } from "react";
import { productService } from "./services/product.service";
import type { Product, ProductFormData } from "./types/product";

const initialForm: ProductFormData = {
  name: "",
  description: "",
  price: 0,
  category: "",
  active: true,
};

type AlertState = {
  type: "success" | "danger";
  text: string;
} | null;

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<ProductFormData>(initialForm);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [message, setMessage] = useState<AlertState>(null);

  const loadProducts = async () => {
    try {
      const data = await productService.getAll();
      setProducts(data);
    } catch {
      setMessage({ type: "danger", text: "Erro ao carregar produtos." });
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setMessage(null);
        await loadProducts();
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = event.target;

    if (type === "checkbox") {
      const checked = (event.target as HTMLInputElement).checked;
      setForm((prev) => ({
        ...prev,
        [name]: checked,
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value,
    }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingProductId(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);

    try {
      setSubmitting(true);

      if (editingProductId !== null) {
        await productService.update(editingProductId, form);
        setMessage({
          type: "success",
          text: "Produto atualizado com sucesso.",
        });
      } else {
        await productService.create(form);
        setMessage({
          type: "success",
          text: "Produto cadastrado com sucesso.",
        });
      }

      resetForm();
      await loadProducts();
    } catch {
      setMessage({ type: "danger", text: "Erro ao salvar produto." });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (product: Product) => {
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      active: product.active,
    });

    setEditingProductId(product.id);
    setMessage(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Tem certeza que deseja excluir este produto?",
    );

    if (!confirmed) return;

    try {
      await productService.remove(id);
      setMessage({ type: "success", text: "Produto removido com sucesso." });

      if (editingProductId === id) {
        resetForm();
      }

      await loadProducts();
    } catch {
      setMessage({ type: "danger", text: "Erro ao remover produto." });
    }
  };

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-lg-10 mx-auto">
          <h1 className="mb-4">Gerenciamento de Produtos</h1>

          {message && (
            <div className={`alert alert-${message.type}`} role="alert">
              {message.text}
            </div>
          )}

          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h2 className="h4 mb-3">
                {editingProductId !== null
                  ? "Editar Produto"
                  : "Cadastrar Produto"}
              </h2>

              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label htmlFor="name" className="form-label">
                      Nome
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      className="form-control"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="category" className="form-label">
                      Categoria
                    </label>
                    <input
                      id="category"
                      name="category"
                      type="text"
                      className="form-control"
                      value={form.category}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="price" className="form-label">
                      Preço
                    </label>
                    <input
                      id="price"
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      className="form-control"
                      value={form.price}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6 d-flex align-items-end">
                    <div className="form-check mb-2">
                      <input
                        id="active"
                        name="active"
                        type="checkbox"
                        className="form-check-input"
                        checked={form.active}
                        onChange={handleChange}
                      />
                      <label htmlFor="active" className="form-check-label">
                        Produto ativo
                      </label>
                    </div>
                  </div>

                  <div className="col-12">
                    <label htmlFor="description" className="form-label">
                      Descrição
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      className="form-control"
                      rows={3}
                      value={form.description}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-12 d-flex gap-2">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={submitting}
                    >
                      {submitting
                        ? "Salvando..."
                        : editingProductId !== null
                          ? "Atualizar"
                          : "Cadastrar"}
                    </button>

                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={resetForm}
                    >
                      {editingProductId !== null ? "Cancelar" : "Limpar"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="h4 mb-3">Lista de Produtos</h2>

              {loading ? (
                <p className="mb-0">Carregando produtos...</p>
              ) : products.length === 0 ? (
                <p className="mb-0">Nenhum produto cadastrado.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped table-hover align-middle">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Categoria</th>
                        <th>Preço</th>
                        <th>Status</th>
                        <th>Criado em</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product.id}>
                          <td>{product.id}</td>
                          <td>{product.name}</td>
                          <td>{product.category}</td>
                          <td>R$ {product.price.toFixed(2)}</td>
                          <td>
                            <span
                              className={`badge ${
                                product.active ? "bg-success" : "bg-secondary"
                              }`}
                            >
                              {product.active ? "Ativo" : "Inativo"}
                            </span>
                          </td>
                          <td>
                            {new Date(product.createdAt).toLocaleString(
                              "pt-BR",
                            )}
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <button
                                type="button"
                                className="btn btn-sm btn-warning"
                                onClick={() => handleEdit(product)}
                              >
                                Editar
                              </button>
                              <button
                                type="button"
                                className="btn btn-sm btn-danger"
                                onClick={() => handleDelete(product.id)}
                              >
                                Excluir
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;