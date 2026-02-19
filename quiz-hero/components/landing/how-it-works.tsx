export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-20 px-4 bg-transparent"
    >
      <div className="container mx-auto">

        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 drop-shadow-sm">
            See How AI Supercharges Your Recall
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            From JEE to UPSC, top scorers know: <strong>recall beats revision</strong>.
            Watch how our AI instantly turns your syllabus into smart quizzes
            that help you remember faster and perform better under exam pressure.
          </p>
        </div>

        {/* Video Showcase */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 hover:shadow-blue-500/20 transition-shadow">

            <div className="relative aspect-video">
              <iframe
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="AI Quiz Demo Video"
                className="absolute inset-0 w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
            </div>

            {/* Caption */}
            <div className="p-6 bg-gray-50">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                From Notes to Quiz in Minutes
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Watch as we upload real exam notes and instantly generate
                adaptive quizzes tailored to improve your recall power.
                No repetitive revision — just active learning that sticks.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
