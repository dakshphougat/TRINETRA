const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">
            Our Mission
          </h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Making Print Media Accessible to All
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            TriNetra aims to bridge the gap between print and digital
            accessibility, empowering visually impaired individuals with modern
            technology.
          </p>
        </div>

        <div className="mt-10">
          <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            <div className="relative">
              <dt>
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  1
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                  Instant Text Recognition
                </p>
              </dt>
              <dd className="mt-2 ml-16 text-base text-gray-500">
                Advanced OCR technology to quickly and accurately convert
                printed text into digital format.
              </dd>
            </div>

            <div className="relative">
              <dt>
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  2
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                  Natural Voice Output
                </p>
              </dt>
              <dd className="mt-2 ml-16 text-base text-gray-500">
                High-quality text-to-speech conversion for a natural listening
                experience.
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default About;
