// Shows the protected page only when the user is logged in.
// Otherwise it shows the fallback (the login page).
//
// Usage:
//   <ProtectedRoute isAuth={isAdmin} fallback={<AdminLogin onLogin={...} />}>
//     <Admin />
//   </ProtectedRoute>
export default function ProtectedRoute({ isAuth, fallback, children }) {
  return isAuth ? children : fallback;
}
