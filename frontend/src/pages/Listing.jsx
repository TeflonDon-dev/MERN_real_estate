import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import {
  FaShare,
  FaMapMarkerAlt,
  FaBed,
  FaBath,
  FaParking,
  FaChair,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import Contact from "../components/Contact";

const Listing = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [contact, setContact] = useState(false);
  SwiperCore.use([Navigation]);
  const params = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);
  return (
    <main>
      {loading && <p className=" text-center my-7 text-2xl">loading...</p>}
      {error && (
        <p className=" text-center my-7 text-2xl text-red-700">
          something went wrong
        </p>
      )}
      {listing && !loading && !error && (
        <>
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className=" h-[550px]"
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div
            className=" fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              setCopied(true);
              setTimeout(() => {
                setCopied(false);
              }, 2000);
            }}
          >
            <FaShare className=" text-slate-500 " />
          </div>
          {copied && (
            <p className=" fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2">
              Link copied!
            </p>
          )}
          <div className=" flex flex-col max-w-4xl mx-auto p-3 gap-4">
            <p className=" text-2xl font-semibold">
              {listing.name}- ${" "}
              {listing.offer
                ? listing.discountPrice.toLocaleString("en-US")
                : listing.regularPrice.toLocaleString("en-US")}{" "}
              {listing.type === "rent" && " / month"}
            </p>
            <p className=" flex  items-center mt-6  gap-2 text-slate-600 my-2 text-sm ">
              <FaMapMarkerAlt className=" text-green-700" />
              {listing.address}
            </p>
            <div className=" flex gap-4 ">
              <p className=" bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                {listing.type === "rent" ? "For Rent" : " For sale"}
              </p>
              {listing.offer && (
                <p className=" bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                  ${+listing.regularPrice - +listing.discountPrice} off
                </p>
              )}
            </div>
            <p className=" text-slate-800">
              <span className=" font-semibold text-black">Description -</span>{" "}
              {listing.description}
            </p>
            <ul className="text-green-900 font-semibold text-sm flex items-center gap-4 md:gap-6 flex-wrap">
              <li className=" flex items-center gap-1 whitespace-normal ">
                <FaBed className=" text-lg" />
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} beds`
                  : `${listing.bedrooms} bed`}
              </li>
              <li className=" flex items-center gap-1 whitespace-normal ">
                <FaBath className=" text-lg" />
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} baths`
                  : `${listing.bathrooms} bath`}
              </li>
              <li className=" flex items-center gap-1 whitespace-normal ">
                <FaParking className=" text-lg" />
                {listing.parking ? "Parking spot" : "No Parking"}
              </li>
              <li className=" flex items-center gap-1 whitespace-normal ">
                <FaChair className=" text-lg" />
                {listing.furnished ? "Furnished" : "Unfurnished"}
              </li>
            </ul>
            {currentUser && listing.userRef !== currentUser._id && !contact && (
              <button
                onClick={() => setContact(true)}
                className=" text-white rounded-lg uppercase hover:opacity-95 p-3 bg-slate-700"
              >
                Contact Landlord
              </button>
            )}
            {contact && <Contact listing={listing} />}
          </div>
        </>
      )}
    </main>
  );
};

export default Listing;
