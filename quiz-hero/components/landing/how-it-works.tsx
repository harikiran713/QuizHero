export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 px-4 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto">
      
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">See QuizAI in Action</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Watch how our AI transforms any content into engaging quizzes in just minutes. See the magic happen from
            upload to deployment.
          </p>
        </div>

    
        <div className="max-w-4xl mx-auto mb-16">
          <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
           
            <div className="relative aspect-video">
              <iframe
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="QuizAI Demo Video"
                className="absolute inset-0 w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
            </div>

            {/* Video Caption */}
            <div className="p-6 bg-white">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Complete QuizAI Walkthrough</h3>
              <p className="text-gray-600">
                Follow along as we demonstrate the entire process from content upload to quiz deployment, showing you
                exactly how our AI creates intelligent questions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
