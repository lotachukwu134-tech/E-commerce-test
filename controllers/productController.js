import { Product } from "../models/productModel.js";

export const createProduct = async(req, res)=>{
try{
const {name, description,price,category,sizes,colours,stock,images}=req.body

const newProduct = await Product.created({
    name,
    description,
    price,
    category,
    sizes,
    colour,
    stock,
    images,
    createdBy:req.user.id
})
await newProduct.save()

return res.status(201).json({
    success:true,
    message:"new product created",
    newProduct
})
}catch(error){
return res.status(500).json({
    success:false,
    message:"Error creating product"
})
}
}

//UPDATE PRODUCT
// export const updateProduct = async(req,res)=>{
// try{
// const {name, description,price,category,sizes,colours,stock,images}=req.body

// const product = await Product.findById(id)
// if(!product){
//     return res.status(404).json({
//         success:false,
//         message:"Not Found"
//     })
// }
// if(name) product.name = name;
// if(description) product.description=description;
// if(price) product.price=price;
// if(category) product.category=category;
// if(sizes) product.sizes=sizes;
// if(colours) product.colours=colours;
// if(stock) product.stock=stock;
// if(images) product.images=images

// await product.save()
// return res.status(200).json({
// success:true,
// message:"Updated Product",
// product
// })
// console.log(product)

// }catch(error){
// return res.status(500).json({
//     success:false,
//     message:"Error updated product "
// })
// }
// console.log(error)
// }

//UPDATE USER
export const updateProduct = async(req,res)=>{
    try{
const product = await product.findById(req.params.id)
if(!product)
    return res.status(404).json({
        success:false,
        message:"Product not found"
    })

    const updatedProduct = await product.findByIdAndUpdate(
        req.params.id,
        {$set:req.body},
        {new:true, runValidators:true}
    );
    return res.status(200).json({
        success:true,
        message:"product updated successfully",
        data:updateProduct
    })

    }catch(error){
return res.status(500).json({
    success:false,
    message:"error updating product"
})
    }
}