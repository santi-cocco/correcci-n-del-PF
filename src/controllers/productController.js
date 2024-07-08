import fs from "fs";
import Product from "../Dao/models/products.js";

export default class ProductManager {
  constructor(path) {
    this.path = path;
  }

  getProducts = async (info) => {
    try {
      const { page = 1, pageSize = 10 } = info;
      const skip = (page - 1) * pageSize;
  
      if (fs.existsSync(this.path)) {
        const productlist = await fs.promises.readFile(this.path, "utf-8");
        const productlistJs = JSON.parse(productlist);
        const paginatedProducts = productlistJs.slice(skip, skip + pageSize);
  
        return {
          totalProducts: productlistJs.length,
          currentPage: page,
          pageSize: pageSize,
          products: paginatedProducts,
        };
      } else {
        return {
          totalProducts: 0,
          currentPage: page,
          pageSize: pageSize,
          products: [],
        };
      }
    } catch (error) {
      throw new Error(error);
    }
  };

  getProductById = async (id) => {
    try {
      const { pid } = id;
      if (fs.existsSync(this.path)) {
        const allproducts = await this.getProducts({});
        const found = allproducts.find((element) => element.id === parseInt(pid));
        if (found) {
          return found;
        } else {
          throw new Error("Product not found");
        }
      } else {
        throw new Error("Product file not found");
      }
    } catch (error) {
      throw new Error(error);
    }
  };

  generateId = async () => {
    try {
      if (fs.existsSync(this.path)) {
        const productlist = await fs.promises.readFile(this.path, "utf-8");
        const productlistJs = JSON.parse(productlist);
        const counter = productlistJs.length;
        if (counter === 0) {
          return 1;
        } else {
          return productlistJs[counter - 1].id + 1;
        }
      }
    } catch (error) {
      throw new Error(error);
    }
  };

  addProduct = async (obj) => {
    const { title, description, price, thumbnail, category, status = true, code, stock } = obj;
    if (!title || !description || !price || !category || !code || !status || !stock) {
      throw new Error("Please provide all product details.");
    } else {
      const productList = await this.getProducts({});
      const codeExists = productList.find((element) => element.code === code);
      if (codeExists) {
        throw new Error("The product code you're trying to add already exists.");
      } else {
        const id = await this.generateId();
        const productNew = {
          id,
          title,
          description,
          price,
          category,
          status,
          thumbnail,
          code,
          stock,
        };
        productList.push(productNew);
        await fs.promises.writeFile(this.path,
          JSON.stringify(productList, null, 2)
        );
        return productNew;
      }
    }
  };

  updateProduct = async (id, obj) => {
    const { pid } = id;
    const { title, description, price, category, thumbnail, status, code, stock } = obj;
    if (!title || !description || !price || !category || !code || !status || !stock) {
      throw new Error("Please provide all product details for update.");
    } else {
      const productList = await this.getProducts({});
      const codeExists = productList.find((i) => i.code === code);
      if (codeExists) {
        throw new Error("The product code you're trying to update already exists.");
      } else {
        const newProductsList = productList.map((elemento) => {
          if (elemento.id === parseInt(pid)) {
            const updatedProduct = {
              ...elemento,
              title,
              description,
              price,
              category,
              status,
              thumbnail,
              code,
              stock
            };
            return updatedProduct;
          } else {
            return elemento;
          }
        });
        await fs.promises.writeFile(this.path, JSON.stringify(newProductsList, null, 2));
        return newProductsList.find((element) => element.id === parseInt(pid));
      }
    }
  };

  deleteProduct = async (id) => {
    const allProducts = await this.getProducts({});
    const productsWithoutDeleted = allProducts.filter(
      (element) => element.id !== parseInt(id)
    );
    await fs.promises.writeFile(this.path, JSON.stringify(productsWithoutDeleted, null, 2));
    return "Product deleted successfully";
  };

  getProductsView = async () => {
    try {
      if (fs.existsSync(this.path)) {
        const productlist = await fs.promises.readFile(this.path, "utf-8");
        const productlistJs = JSON.parse(productlist);
        return productlistJs;
      } else {
        return [];
      }
    } catch (error) {
      throw new Error(error);
    }
  };
}

// Controlador adicional para obtener productos paginados
export const getProducts = async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;
    const options = {
      limit: parseInt(limit),
      page: parseInt(page),
      sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {},
    };

    const filter = query ? { $or: [{ category: query }, { availability: query }] } : {};

    const products = await Product.paginate(filter, options);

    res.json({
      status: 'success',
      payload: products.docs,
      totalPages: products.totalPages,
      prevPage: products.hasPrevPage ? products.prevPage : null,
      nextPage: products.hasNextPage ? products.nextPage : null,
      page: products.page,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevLink: products.hasPrevPage ? `/api/products?limit=${limit}&page=${products.prevPage}&sort=${sort}&query=${query}` : null,
      nextLink: products.hasNextPage ? `/api/products?limit=${limit}&page=${products.nextPage}&sort=${sort}&query=${query}` : null,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
