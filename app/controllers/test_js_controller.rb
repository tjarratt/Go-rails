class TestJsController < ActionController::Base
  def not_production
    if Rails.env.production?
      render :status => 404
    end
  end

  def index
    test_dir = "#{Rails.root}/app/assets/javascripts/test/test_*.js"

    @js_tests = Dir.glob(test_dir).map do |test|
      test.split('/').last
    end
  end
end
