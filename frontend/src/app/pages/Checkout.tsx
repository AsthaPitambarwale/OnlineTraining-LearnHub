import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useRealtimeCourses } from "../hooks/useRealtimeData";
import { toast } from "sonner";
import { CreditCard, Lock, CheckCircle } from "lucide-react";

export function Checkout() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, purchaseCourse } = useAuth();
  const [loading, setLoading] = useState(false);
  const courses = useRealtimeCourses();

  const course = courses.find((c) => String(c.id) === String(id));

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl mb-4">Course not found</h1>
        </div>
      </div>
    );
  }

  if (!user) return null;

  // Prevent admin purchase
  if (user.role === "admin") {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl mb-4">Admins cannot purchase courses</h1>
          <p className="text-gray-600">
            Admin accounts already have access to all courses.
          </p>

          <button
            onClick={() => navigate("/courses")}
            className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg"
          >
            Browse Courses
          </button>
        </div>
      </div>
    );
  }

  // Prevent duplicate purchase
  if (user.purchasedCourses?.includes(course.id)) {
    navigate(`/learn/${course.id}`);
    return null;
  }

  const gst = course.price * 0.18;
  const total = course.price + gst;

  const handleRazorpayPayment = async () => {
  if (loading) return;

  setLoading(true);

  try {
    // ✅ CREATE ORDER (FIXED)
    const orderRes = await fetch(
  `${import.meta.env.VITE_API_URL}/api/razorpay/create-order`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ amount: total }),
  }
);

    // ✅ SAFE JSON HANDLING
    if (!orderRes.ok) {
      const text = await orderRes.text();
      console.error("Order API error:", text);
      throw new Error("Order creation failed");
    }

    const order = await orderRes.json();

    if (!order.id) {
      throw new Error("Order creation failed");
    }

    const options = {
      key: "rzp_test_SbQVicrIicuy82",
      amount: order.amount,
      currency: "INR",
      name: "LearnHub",
      description: course.title,
      order_id: order.id,

      handler: async function (response: any) {
        try {
          // ✅ VERIFY PAYMENT (FIXED)
const verify = await fetch(
  `${import.meta.env.VITE_API_URL}/api/razorpay/verify`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      razorpay_order_id: response.razorpay_order_id,
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_signature: response.razorpay_signature,
      userId: user.id,
      userName: user.name,
      courseId: course.id,
      courseTitle: course.title,
      amount: total,
    }),
  }
);

          if (!verify.ok) {
            const text = await verify.text();
            console.error("Verify API error:", text);
            throw new Error("Verification failed");
          }

          const data = await verify.json();

          if (data.success) {
            purchaseCourse(course.id);

            toast.success("Payment successful!");

            navigate(`/learn/${course.id}`);
          } else {
            toast.error("Payment verification failed");
          }
        } catch (err) {
          console.error(err);
          toast.error("Verification failed");
        }
      },

      prefill: {
        name: user.name,
        email: user.email,
      },

      theme: {
        color: "#2563eb",
      },
    };

    const razor = new (window as any).Razorpay(options);
    razor.open();
  } catch (err) {
    console.error(err);
    toast.error("Payment failed");
  }

  setLoading(false);
};
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payment Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-xl mb-4">Payment Method</h2>

              <div className="border border-gray-200 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-3 mb-2">
                  <CreditCard className="w-6 h-6 text-blue-600" />
                  <span className="font-medium">Pay with Razorpay</span>
                </div>

                <p className="text-sm text-gray-600">
                  Credit Card, Debit Card, Net Banking, UPI, Wallets
                </p>
              </div>

              <button
                onClick={handleRazorpayPayment}
                disabled={loading}
                className="w-full py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
              >
                {loading ? (
                  "Processing..."
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    Pay ₹{total.toLocaleString()}
                  </>
                )}
              </button>

              <p className="text-sm text-gray-500 text-center mt-3">
                Secure payment powered by Razorpay
              </p>
            </div>

            {/* Guarantee */}
            <div className="bg-blue-50 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-blue-600" />

                <div>
                  <h3 className="font-medium text-blue-900 mb-2">
                    30-Day Money-Back Guarantee
                  </h3>

                  <p className="text-sm text-blue-700">
                    Not satisfied? Get a full refund within 30 days.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h2 className="text-xl mb-4">Order Summary</h2>

              <img
                src={
                  course.thumbnail || "https://dummyimage.com/600x400/000/fff"
                }
                alt={course.title}
                className="w-full aspect-video object-cover rounded-lg mb-3"
              />

              <h3 className="font-medium">{course.title}</h3>
              <p className="text-sm text-gray-600">{course.instructor}</p>

              <div className="border-t pt-4 space-y-3 mt-4">
                <div className="flex justify-between">
                  <span>Course Price</span>
                  <span>₹{course.price}</span>
                </div>

                <div className="flex justify-between">
                  <span>GST (18%)</span>
                  <span>₹{gst.toFixed(2)}</span>
                </div>

                <div className="border-t pt-3 flex justify-between font-medium">
                  <span>Total</span>
                  <span className="text-xl">₹{total.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6 space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Lifetime access
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  All course materials
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Certificate of completion
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
