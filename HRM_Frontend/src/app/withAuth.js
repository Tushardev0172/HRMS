// "use client";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import { useCookies } from "react-cookie";
// import routes from "./routeConfig";
// import { useUser } from "./userContext";

// const withAuth = (WrappedComponent) => {
//   const AuthComponent = (props) => {
//     const { user } = useUser();
//     const [cookies] = useCookies(["token"]);
//     const router = useRouter();
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//       const token = cookies.token;

//       if (!token && router.pathname !== "/login") {
//         router.push("/login");
//         setLoading(false);
//         return;
//       }

//       try {
//         if (!user) {
//           setLoading(false);
//           return;
//         }
//         const role = user.role;
//         const routeConfigForRole = routes.find((route) =>
//           route.roles.includes(role)
//         );

//         if (routeConfigForRole) {
//           const allowedPaths = routeConfigForRole.path;
//           const currentPath = window.location.pathname;
//           if (allowedPaths.includes(currentPath)) {
//             setLoading(false);
//             return;
//           } else {
//             router.push(allowedPaths[0]);
//           }
//         } else {
//           router.push("/unauthorized");
//         }
//       } catch (error) {
//         console.error("Error decoding token:", error);
//         router.push("/login");
//       }
//     }, [cookies.token, user, router.pathname, router]);

//     if (loading) {
//       return <h1>Loading...</h1>;
//     }

//     // Render the wrapped component only when loading is false
//     return !loading && <WrappedComponent {...props} />;
//   };

//   return AuthComponent;
// };

// export default withAuth;


"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import routes from "./routeConfig";
import { useUser } from "./userContext";

// Preloader component with CSS spinner animation
const Preloader = () => {
  return (
    <div className="loader-container">
      <div className="loader"></div>
    </div>
  );
};

const withAuth = (WrappedComponent) => {
  const AuthComponent = (props) => {
    const { user } = useUser();
    const [cookies] = useCookies(["token"]);
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const token = cookies.token;

      if (!token && router.pathname !== "/login") {
        router.push("/login");
        setLoading(false);
        return;
      }

      try {
        if (!user) {
          setLoading(false);
          return;
        }
        const role = user.role;
        const routeConfigForRole = routes.find((route) =>
          route.roles.includes(role)
        );

        if (routeConfigForRole) {
          const allowedPaths = routeConfigForRole.path;
          const currentPath = window.location.pathname;
          if (allowedPaths.includes(currentPath)) {
            setLoading(false);
            return;
          } else {
            router.push(allowedPaths[0]);
          }
        } else {
          router.push("/unauthorized");
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        router.push("/login");
      }
    }, [cookies.token, user, router.pathname, router]);

    // Render the preloader when loading is true
    if (loading) {
      return <Preloader />;
    }

    // Render the wrapped component only when loading is false
    return !loading && <WrappedComponent {...props} />;
  };

  return AuthComponent;
};

export default withAuth;
