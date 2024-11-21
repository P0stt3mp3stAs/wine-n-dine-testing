// 'use client'

// import { useState, FormEvent, ChangeEvent } from 'react'
// import { Amplify } from 'aws-amplify'
// import { signUp, confirmSignUp, signIn, resendSignUpCode } from 'aws-amplify/auth'
// import { useRouter } from 'next/navigation'
// import Link from 'next/link'

// interface FormData {
//   email: string;
//   name: string;
//   password: string;
//   confirmPassword: string;
// }

// export default function SignUp() {
//   const router = useRouter()
//   const [formData, setFormData] = useState<FormData>({
//     email: '',
//     username: '',
//     password: '',
//     confirmPassword: '',
//   })
//   const [error, setError] = useState<string>('')
//   const [loading, setLoading] = useState<boolean>(false)
//   const [showConfirmation, setShowConfirmation] = useState<boolean>(false)
//   const [confirmationCode, setConfirmationCode] = useState<string>('')

//   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }))
//   }

//   const validateForm = (): boolean => {
//     if (formData.password !== formData.confirmPassword) {
//       setError('Passwords do not match')
//       return false
//     }
//     if (formData.password.length < 8) {
//       setError('Password must be at least 8 characters long')
//       return false
//     }
//     return true
//   }

//   const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (!validateForm()) return;
  
//     setError('');
//     setLoading(true);
  
//     try {
//       console.log('Attempting to sign up with:', formData.email);
//       const signUpResponse = await signUp({
//         username: formData.email,
//         password: formData.password,
//         attributes: {
//           email: formData.email,
//           'name.formatted': formData.name,
//         },
//       });
//       console.log('Sign up response:', signUpResponse);
//       setShowConfirmation(true);
//     } catch (err) {
//       console.error('Sign up error:', err);
//       setError(err instanceof Error ? err.message : 'An error occurred during sign up');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleConfirmSignUp = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);
  
//     try {
//       await confirmSignUp({
//         username: formData.username,
//         confirmationCode,
//       });
//       await signIn({
//         username: formData.username,
//         password: formData.password,
//       });
//       router.push('/');
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'An error occurred during confirmation');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resendConfirmationCode = async () => {
//     try {
//       await resendSignUpCode({
//         username: formData.email
//       })
//       alert('Confirmation code has been resent')
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Error resending confirmation code')
//     }
//   }

//   if (showConfirmation) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-md w-full space-y-8">
//           <div>
//             <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//               Verify your email
//             </h2>
//             <p className="mt-2 text-center text-sm text-gray-600">
//               We sent a confirmation code to {formData.email}
//             </p>
//           </div>

//           <form className="mt-8 space-y-6" onSubmit={handleConfirmSignUp}>
//             {error && (
//               <div className="rounded-md bg-red-50 p-4">
//                 <div className="text-sm text-red-700">{error}</div>
//               </div>
//             )}

//             <div className="rounded-md shadow-sm -space-y-px">
//               <input
//                 type="text"
//                 required
//                 className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
//                 placeholder="Confirmation Code"
//                 value={confirmationCode}
//                 onChange={(e) => setConfirmationCode(e.target.value)}
//               />
//             </div>

//             <div>
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-300"
//               >
//                 {loading ? 'Verifying...' : 'Verify Email'}
//               </button>
//             </div>

//             <div className="text-center">
//               <button
//                 type="button"
//                 onClick={resendConfirmationCode}
//                 className="text-sm text-red-600 hover:text-red-500"
//               >
//                 Resend confirmation code
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full space-y-8">
//         <div>
//           <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//             Create your account
//           </h2>
//           <p className="mt-2 text-center text-sm text-gray-600">
//             Or{' '}
//             <Link href="/auth/signin" className="font-medium text-red-600 hover:text-red-500">
//               sign in to your account
//             </Link>
//           </p>
//         </div>

//         <form className="mt-8 space-y-6" onSubmit={handleSignUp}>
//           {error && (
//             <div className="rounded-md bg-red-50 p-4">
//               <div className="text-sm text-red-700">{error}</div>
//             </div>
//           )}

//           <div className="rounded-md shadow-sm -space-y-px">
//             <div>
//               <label htmlFor="email" className="sr-only">
//                 Email address
//               </label>
//               <input
//                 id="email"
//                 name="email"
//                 type="email"
//                 required
//                 className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
//                 placeholder="Email address"
//                 value={formData.email}
//                 onChange={handleChange}
//               />
//             </div>
//             <div>
//               <label htmlFor="name" className="sr-only">
//                 Name
//               </label>
//               <input
//                 id="name"
//                 name="name"
//                 type="text"
//                 required
//                 className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
//                 placeholder="Name"
//                 value={formData.name}
//                 onChange={handleChange}
//               />
//             </div>
//             <div>
//               <label htmlFor="password" className="sr-only">
//                 Password
//               </label>
//               <input
//                 id="password"
//                 name="password"
//                 type="text"
//                 required
//                 className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
//                 placeholder="Password"
//                 value={formData.password}
//                 onChange={handleChange}
//               />
//             </div>
//             <div>
//               <label htmlFor="confirmPassword" className="sr-only">
//                 Confirm Password
//               </label>
//               <input
//                 id="confirmPassword"
//                 name="confirmPassword"
//                 type="text"
//                 required
//                 className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
//                 placeholder="Confirm Password"
//                 value={formData.confirmPassword}
//                 onChange={handleChange}
//               />
//             </div>
//           </div>

//           <div>
//             <button
//               type="submit"
//               disabled={loading}
//               className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-300"
//             >
//               {loading ? 'Creating account...' : 'Sign up'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   )
// }