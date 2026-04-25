import Image from "next/image";
import ProductCategories from "@/components/ProductCategories";
import Slider from "@/components/Slider";
import Bestseller from "@/components/BestSeller";
import HomeVideoSection from "@/components/HomeVideoSection";
import Whyus from "@/components/WhyUs";
import BlogPost from "@/components/BLogPosts";
import OurStory from "@/components/OurStory";
export default function Home() {
  return (
    <>
      <Slider/>
      <ProductCategories/>
      <HomeVideoSection/>
      <Bestseller/>
      <Whyus/>
      <OurStory/>
      <BlogPost/>
    </>
  );
}
