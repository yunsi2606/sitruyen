import { fetchAPI } from "./api";

// Cookie helpers
function setCookie(name: string, value: string, days: number) {
    if (typeof document === "undefined") return;
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/;SameSite=Lax";
}

function getCookie(name: string) {
    if (typeof document === "undefined") return null;
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function deleteCookie(name: string) {
    if (typeof document === "undefined") return;
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

// Auth API
export const auth = {
    // Login
    async login(identifier: string, password: string) {
        try {
            const data = await fetchAPI("/auth/local", {}, {
                method: "POST",
                body: JSON.stringify({
                    identifier,
                    password,
                }),
            });

            if (data.jwt) {
                setCookie("token", data.jwt, 30); // 30 days
                setCookie("user", JSON.stringify(data.user), 30);
                return { success: true, user: data.user };
            } else {
                return { success: false, error: data.error?.message || "Login failed" };
            }
        } catch (error) {
            return { success: false, error: "An unexpected error occurred" };
        }
    },

    // Register
    async register(username: string, email: string, password: string) {
        try {
            const data = await fetchAPI("/auth/local/register", {}, {
                method: "POST",
                body: JSON.stringify({
                    username,
                    email,
                    password,
                }),
            });

            if (data.jwt) {
                setCookie("token", data.jwt, 30);
                setCookie("user", JSON.stringify(data.user), 30);
                return { success: true, user: data.user };
            } else {
                return { success: false, error: data.error?.message || "Registration failed" };
            }
        } catch (error) {
            return { success: false, error: "An unexpected error occurred" };
        }
    },

    // Logout
    logout() {
        deleteCookie("token");
        deleteCookie("user");
        // Optional: Redirect or reload
        if (typeof window !== "undefined") {
            window.location.href = "/login";
        }
    },

    // Get Current User (from cookie for now, ideally verify with API if critical)
    getUser() {
        const userStr = getCookie("user");
        if (userStr) {
            try {
                return JSON.parse(userStr);
            } catch (e) {
                return null;
            }
        }
        return null;
    },

    isAuthenticated() {
        return !!getCookie("token");
    }
};
