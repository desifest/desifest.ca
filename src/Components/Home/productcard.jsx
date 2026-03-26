const ProductCard = ({
    image,
    title,
    price,
    badgeText = "SHOP NOW",
  }) => {
    return (
      <div className="w-84.5 h-104 bg-midnight-purple p-2 relative text-white shadow-lg">
        
        {/* IMAGE AREA */}
        <div className=" bg-white p-6 flex items-center justify-center">
          <img
            src={image}
            alt={title}
            draggable="false"
            className="max-h-50  object-contain"
          />
  
          {/* BADGE */}
          <span className="absolute top-0 right-0  bg-neon-yellow text-black text-xs oswaldd font-medium px-3 py-2 ">
            {badgeText}
          </span>
        </div>
  
        {/* CONTENT */}
        <div className="p-5 space-y-1">
          <h3 className="text-[24px] font-medium dm-sans-400  leading-snug">
            {title}
          </h3>
  
          <p className="text-[18px] special-gothic-one-regular font-bold">
            ${price}
          </p>
        </div>
      </div>
    );
  };
  
  export default ProductCard;
  