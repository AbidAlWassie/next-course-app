import React from "react";

interface CarouselProps {
  items: React.ReactNode[];
}

const Carousel: React.FC<CarouselProps> = ({ items }) => {
  return (
    <div className="carousel carousel-center bg-neutral rounded-box max-w-md space-x-4 p-4">
      {items.map((item, index) => (
        <div key={index} className="carousel-item">
          {item}
        </div>
      ))}
    </div>
  );
};

export default Carousel;
