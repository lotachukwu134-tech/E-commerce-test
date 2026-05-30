import { Product } from "../models/productModel.js";

//CREATE PRODUCT -ADMIN ONLY
export const createProduct = async(req, res)=>{
try{
const {name, description,price,category,sizes,colour,stock,images}=req.body

const newProduct = await Product.create({
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
console.log(newProduct)

return res.status(201).json({
    success:true,
    message:"new product created",
    newProduct
})
}catch(error){
return res.status(500).json({
    success:false,
    message:error.message||"Error creating product"
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

//UPDATE PRODUCT -ADMIN ONLY
export const updateProduct = async(req,res)=>{
    try{
const product = await Product.findById(req.params.id)
if(!product)
    return res.status(404).json({
        success:false,
        message:"Product not found"
    })

    const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        {$set:req.body},
        {new:true, runValidators:true}
    );
    return res.status(200).json({
        success:true,
        message:"product updated successfully",
        data:updatedProduct
    })

    }catch(error){
return res.status(500).json({
    success:false,
    message:error.message||"error updating product"
})
    }
}

//DELETE PRODUCT -ADMIN ONLY
export const deleteProduct = async(req,res)=>{
    try{
        const deletePro = await Product.findById(req.params.id)
        if(!deletePro){
            return res.status(404).json({
                success:false,
                message:"User not found"
            })
        }
        const deletedProduct = await Product.findByIdAndDelete(req.params.id)
        return res.status(200).json({
            success:"true",
            message:"Product deleted successfully"
        })

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Error deleting product"
        })

    }
}

//FILTER BY CATEGORY
// export const getProductsByCategory = async (req, res) => {
//   try {
//     const products = await Product.find({
//       category: req.params.cat,
//     });

//     res.status(200).json({
//       success: true,
//       count: products.length,
//       products,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

//GET PRODUCTS
//export const getProducts = async (req, res) => {
//   try {
//     // Pagination
//     const page = Number(req.query.page) || 1;
//     const limit = Number(req.query.limit) || 10;
//     const skip = (page - 1) * limit;

//     // Filters
//     const filter = {};

//     if (req.query.category) {
//       filter.category = req.query.category;
//     }

    // if (req.query.keyword) {
    //   filter.name = {
    //     $regex: req.query.keyword,
    //     $options: "i",
    //   };
    // }

    // const totalProducts = await Product.countDocuments(filter);

    // const products = await Product.find(filter)
    //   .skip(skip)
    //   .limit(limit)
    //   .sort({ createdAt: -1 });

    // res.status(200).json({
    //   success: true,
//       count: products.length,
//       totalProducts,
//       currentPage: page,
//       totalPages: Math.ceil(totalProducts / limit),
//       products,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
//};
export const getProductsByCategory = async (req, res) => {
try {
  // get category from URL
  const { cat } = req.params;

 // check if category is valid
 const validCategories = [ "shoes","bags","clothes"];
if (!validCategories.includes(cat)) {
 return res.status(400).json({
 success: false,
 message: `Invalid category. Must be one of: ${validCategories.join(', ')}`
 });
 }

 // pagination
const page = parseInt(req.query.page) || 1;
const limit = parseInt(req.query.limit) || 10;
const skip = (page - 1) * limit;

 // fetch products by category
 const products = await Product.find({ category: cat })
 .skip(skip)
 .limit(limit)
 .sort({ createdAt: -1 });
 // count total products in this category
 const total = await Product.countDocuments({ category: cat });

// check if category has any products
 if (total === 0) {
 return res.status(404).json({
 success: false,
 message: `No products found in category: ${cat}`
});
}

 return res.status(200).json({
success: true,
 category: cat,
 data: products,
 pagination: {
 total,
 page,
 limit,
 totalPages: Math.ceil(total / limit)
 }
 });

 } catch (error) {
 console.log(error);
return res.status(500).json({
success: false,
message: "Error occurred while fetching products by category"
});
   }
};

//GET PRODUCTS
export const getProducts = async (req, res) => {
 try {
     // APPLYING PAGINATION 
     const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
       const skip = (page - 1) * limit;

    
     const filter = {};

     // filter by category
     if (req.query.category) {
      filter.category = req.query.category;
     }

      // filter by size
     if (req.query.sizes) {
      filter.sizes = req.query.sizes;
     }

      // filter by color
     if (req.query.colour) {
    filter.colours = req.query.colour;
     }

      // filter by price range
     if (req.query.minPrice || req.query.maxPrice) {
    filter.price = {};
     if (req.query.minPrice) filter.price.$gte = parseInt(req.query.minPrice); // greater than or equal
     if (req.query.maxPrice) filter.price.$lte = parseInt(req.query.maxPrice); // less than or equal
     }

    // filter by stock (only show products that are available on my site)
     if (req.query.inStock) {
    filter.stock = { $gt: 0 };
      }


    const products = await Product.find(filter)
     .skip(skip)
     .limit(limit)
     .sort({ createdAt: -1 });


    const total = await Product.countDocuments(filter);

      return res.status(200).json({
       success: true,
      data: products,
     pagination: {
      total,
      page,
      limit,
     totalPages: Math.ceil(total / limit)
      }
    });

    } catch (error) {
     console.log(error);
     return res.status(500).json({
     success: false,
      message: "Error occurred while fetching products"
 });
  }
};


//GET A SINGLE PRODUCT
export const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};