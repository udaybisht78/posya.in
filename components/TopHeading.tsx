interface TopHeadingProps {
  heading: string;
}

export default function TopHeading({ heading }: TopHeadingProps) {
  return (
    <div className="topHeading flex flex-col items-center text-center mt-5 mb-10">
      <h2 className="text-xl md:text-2xl font-extrabold text-orange-500 tracking-wide">
        {heading}
      </h2>
      <div className="flex items-center gap-1 mt-1">
        <span className="w-2 h-2 bg-sky-400 rounded-full"></span>
        <span className="w-2 h-1 bg-sky-400 rounded-full"></span>
        <span className="h-[3px] w-30 md:w-30 bg-sky-400 rounded-full"></span>
        <span className="w-3 h-1 bg-sky-400 rounded-full"></span>
        <span className="w-2 h-1 bg-sky-400 rounded-full"></span>
        <span className="w-1 h-1 bg-sky-400 rounded-full"></span>
      </div>
    </div>
  );
}