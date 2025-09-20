import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { accessToken, productData } = await request.json()

    if (!accessToken) {
      return NextResponse.json({ success: false, error: 'No access token provided' })
    }

    if (!productData) {
      return NextResponse.json({ success: false, error: 'No product data provided' })
    }

    console.log('[Facebook] Creating post for product:', productData.name)

    // Prepare the detailed post message with AI content
    const postMessage = `🎨 New ${productData.category || 'Product'} Available! 🎨

${productData.name}

${productData.description || 'Beautiful handcrafted item made with love and attention to detail.'}

💰 Price: $${productData.price}
📦 Material: ${productData.material || 'Premium quality materials'}
📏 Dimensions: ${productData.length || 'N/A'}cm x ${productData.width || 'N/A'}cm

✨ Each piece is handmade and unique!

#handmade #artisan #${(productData.category || 'handcrafted').toLowerCase()} #shoplocal #supportartists #oneofakind #craftsmanship #handmadejewelry #artisanjewelry #specialgift #trending #viral #aesthetic #luxury #premium #exclusive #limitededition #artisanmade #handcrafted #unique #specialgift #shopsmall #madewithLove`

    // Return the formatted content for client-side posting
    return NextResponse.json({ 
      success: true, 
      postContent: {
        message: postMessage,
        productName: productData.name,
        category: productData.category,
        price: productData.price,
        material: productData.material,
        images: productData.images || []
      },
      message: 'Post content prepared successfully!' 
    })

  } catch (error) {
    console.error('[Facebook] Exception during post preparation:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error while preparing Facebook post' 
    })
  }
}