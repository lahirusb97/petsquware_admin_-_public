import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import DetailBox from "./DetailBox";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { convertPricesObjectToArray } from "../util/ObjToArray";

export default function ProductViewImgBox() {
  const { product } = useParams();
  const [currentImg, setCurrentImg] = useState(0);
  const [productData, setProductData] = useState(null);

  useEffect(() => {
    const fetchProductData = async () => {
      const docRef = doc(db, "product", product); // Assuming "product" is your collection name

      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const pricingArray = convertPricesObjectToArray(
            docSnap.data().pricing
          );
          setProductData({
            ...docSnap.data(),
            id: docSnap.id,
            pricing: pricingArray,
          });
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      }
    };

    fetchProductData();
  }, [product]);

  const handleImageClick = (index) => {
    setCurrentImg(index);
  };

  // Slider settings
  const settings = {
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    autoplay: false,
    speed: 2000,
    autoplaySpeed: 5000,
    cssEase: "linear",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          dots: true,
        },
      },
    ],
  };

  if (!productData) {
    return <div>Loading...</div>; // Placeholder for when data is being fetched
  }

  // Render conditionally based on the number of images
  const hasMultipleImages = productData.images.length > 1;

  return (
    <div className="flex flex-col md:flex-row justify-center items-center space-y-8 md:space-y-0 md:space-x-8">
      {/* Product Image Display */}
      <div className="max-w-lg">
        <img
          className="w-96 object-contain cursor-pointer"
          src={productData.images[currentImg]}
          alt={`Product ${currentImg}`}
        />
        {hasMultipleImages && (
          <div className="border-2 my-4">
            <Slider {...settings} className="mt-4">
              {productData.images.map((img, index) => (
                <div
                  className="shadow-md"
                  key={index}
                  onClick={() => handleImageClick(index)}
                >
                  <img
                    className="w-96  object-contain cursor-pointer"
                    src={img}
                    alt={`Product ${index}`}
                  />
                </div>
              ))}
            </Slider>
          </div>
        )}
      </div>

      {/* Detail Box Component */}
      <DetailBox productData={productData} />
    </div>
  );
}
