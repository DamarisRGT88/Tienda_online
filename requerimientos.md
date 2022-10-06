## OBJETIVO

Creación de una API que gestione los productos de una tienda Online

### GET/api/products

- Recuperar todos los productos d ela tabla products
    -La URL GET/api/products debe funcionar -> Responda con status 200
    - Debe devolver datos en formato JSON -> Responda con la cabecera Content-type igual a application/json
    -Debe devolver un array de datos

### GET/api/products/PRODUCTID
    -Recuperar un único producto a partir de su ID
    -Extraemos el id del producto de req.params
    -Para recuperar el producto podemos usar findById

### POST/ api/ products

-Método Product.create que recibe el body con los datos a insertar