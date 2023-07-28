import { promises as fs } from 'fs'

class Product {
    static currentId = 0;
    constructor(name, description, price, thumbnail, code, stock) {
        this.id = Product.getNewId();
        this.name = name;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
    }
    static getNewId() {
        Product.currentId++;
        return Product.currentId;
    }
}

class ProductManager {
    constructor() {
        this.products = [];
        this.path = './products.json'
    }

    addProduct = async (product) => {
        if (!this.arePropertiesValid(product)) {
            console.log("El producto no tiene todas las propiedades");
            return;
        }

        let alreayExist = this.products.find(p => p.code === product.code);

        if (alreayExist) {
            console.log("Ya existe un producto con ese codigo");
            return;
        }

        this.products.push(product);
        await this.saveInJsonAsync();
        console.log(`Se agregó el producto con ID: ${product.id}`);
    }

    //Creamos metodo global para guardar en el JSON
    saveInJsonAsync = async () => {
        await fs.writeFile(this.path, JSON.stringify(this.products));
    }

    getProducts = async () => {
        try {
            const data = await fs.readFile(this.path, 'utf8');
            this.products = JSON.parse(data);

            if (this.products.length == 0) {
                console.log("No se encontraron productos");
                return;
            }

            console.log(this.products);
            return this.products;
        }
        catch (err) {
            console.error(err);
            return;
        }
    }

    deleteProduct = async (productId) => {
        const productIndex = this.products.findIndex(p => p.id === productId);
        if (productIndex === -1) {
            console.log(`No se encontró el producto con ID: ${productId}`);
            return;
        }

        this.products[productIndex] = {
            ...{},
            id: productId
        };

        await this.saveInJsonAsync();
    }

    udpateProduct = async (productId, newProduct) => {
        try {
            const data = await fs.readFile(this.path, 'utf8');
            let fileResponse = JSON.parse(data);

            if (fileResponse == 0) {
                console.log("No se encontraron productos");
                return;
            }

            if (!this.arePropertiesValid(product)) {
                console.log("El producto no tiene todas las propiedades");
                return;
            }

            const productIndex = this.products.findIndex(p => p.id === productId);
            if (productIndex === -1) {
                console.log(`No se encontró el producto con ID: ${productId}`);
                return;
            }

            this.products[productIndex] = {
                ...newProduct,
                id: productId
            };

            await this.saveInJsonAsync();
        }
        catch (err) {
            console.error(err);
            return;
        }
    }

    getProductById = async (productId) => {
        try {
            const data = await fs.readFile(this.path, 'utf8');
            let fileResponse = JSON.parse(data);

            let prod = fileResponse.find(p => p.id === productId);
            if (prod) {
                console.log(prod);
                return prod;
            }

            console.log("Not Found");
        }
        catch (err) {
            console.error(err);
            return;
        }
    }

    arePropertiesValid = (product) => {
        const keys = Object.keys(product);
        for (const key of keys) {
            if (!product[key]) {
                return false;
            }
        }
        return true;
    }
}

const productManager = new ProductManager();

let product = new Product("pepe", "descripcion", 232, "C:/images/image.jpg", 101, 20);
let product2 = new Product("pepito", "descripcion", 235, "C:/images/image.jpg", 102, 20);
let productUpdated = new Product("pepitorecargado", "asd", 222, "C:/images/image.jpg", 102, 20);

await productManager.addProduct(product);
await productManager.addProduct(product2);

await productManager.udpateProduct(1, productUpdated);
await productManager.deleteProduct(2);

console.log(productManager.products);
