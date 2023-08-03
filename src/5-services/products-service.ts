import { OkPacket } from "mysql";
import dal from "../2-utils/dal";
import ProductModel from "../3-models/product-model";
import { ResourceNotFoundError } from "../3-models/error-models";
import appConfig from "../2-utils/app-config";
import imageHelper from "../2-utils/image-helper";


// Get all products
async function getAllProducts(): Promise<ProductModel[]> {

    //Create sql:
    const sql = `SELECT productId as id,
                productName as name,
                unitPrice as price,
                unitsInStock as stock,
                CONCAT('${appConfig.domainName}/api/products/',imageName )  as imageUrl
                FROM products`;

    // Get products from database;
    const products = await dal.execute(sql);

    //Return products:
    return products;
}

// Get one product
async function getOneProduct(id: number): Promise<ProductModel> {

    //Create sql:
    const sql = `SELECT
         productId as id, productName as name,
          unitPrice as price,
          unitsInStock as stock FROM products ,
          CONCAT('${appConfig.domainName}/api/products/',imageName )  as imageUrl
          where productID = ${id}`;

    // Get products from database containing one product;
    const products = await dal.execute(sql);

    // Extract the single product:
    const product = products[0];

    // If no such product:
    if (!product) throw new ResourceNotFoundError(id);

    //Return products:
    return products;
}

// Add one product
async function addProduct(product: ProductModel): Promise<ProductModel> {

    // Validate
    product.validate();

    // Save image:
    const imageName =  await imageHelper.saveImage(product.image);

    // Create sql:
    const sql = `INSERT INTO products(productName, UnitPrice, UnitsInStock, ImageName)
                VALUES('${product.name}' ,${product.price}, ${product.stock},'${imageName}' )`;

    // Execute sql, get back info object:
    const info: OkPacket = await dal.execute(sql);

    // Extract new id, set it back in the given product:
    product.id = info.insertId;

    // Get image URL:
    product.imageUrl = `${appConfig.domainName}/api/products/${imageName}`;

    // Remove Give image from product object because we dont response it back
    delete product.image;

    // Return added product
    return product;

}



// Update product of Yogev
async function updateProduct(product: ProductModel): Promise<ProductModel> {


    // Validate
    product.validate();

    let sql = "";
    let imageName = "";

    // If client send image to update:
    if (product.image) {
        const oldImage = await getOldImage(product.id);
        imageName = await imageHelper.updateImage(product.image, oldImage);
        sql = `UPDATE products SET 
                ProductName = '${product.name}',
                UnitPrice = ${product.price},
                UnitsInStock = ${product.stock},
                ImageName = '${imageName}'
                WHERE ProductID = ${product.id}`;
    }
    else {
        sql = `UPDATE products SET 
                ProductName = '${product.name}',
                UnitPrice = ${product.price},
                UnitsInStock = ${product.stock}
                WHERE ProductID = ${product.id}`;
    }

    // Execute sql, get back info object:
    const info: OkPacket = await dal.execute(sql);

    // If no such product:
    if (info.affectedRows === 0) throw new ResourceNotFoundError(product.id);

    // Get image URL:
    product.imageUrl = `${appConfig.domainName}/api/products/${imageName}`;
    

    // Remove Give image from product object because we dont response it back
    delete product.image;

    // Return edited product
    return product;

}

// Delete product: 
async function deleteProduct(id: number): Promise<void> {

    // Take old Image:
    const oldImage= await getOldImage(id);

    // Delete that image
    await imageHelper.deleteImage(oldImage);

    // Create sql:
    const sql = `DELETE FROM products WHERE ProductID = ${id}`;

    // Execute sql, get back info object:
    const info: OkPacket = await dal.execute(sql);

    // If no such product (can also ignore this case):
    if (info.affectedRows === 0) throw new ResourceNotFoundError(id);

}

// Get image name:
async function getOldImage(id: number): Promise<string> {
    const sql = `SELECT imageName FROM products WHERE productId = ${id}`;
    const products = await dal.execute(sql);
    const product = products[0];
    if (!product) return null;
    const imageName = product.imageName;
    return imageName;
}


export default {
    getAllProducts,
    getOneProduct,
    addProduct,
    updateProduct,
    deleteProduct
};