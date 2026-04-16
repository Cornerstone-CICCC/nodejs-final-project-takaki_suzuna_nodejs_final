import { useState } from "react";

interface LoginProps {
    onLoginSuccess?: () => void;
}

function Login({ onLoginSuccess }: LoginProps) {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement actual authentication
        onLoginSuccess?.();
    };

    return (
        <div className="bg-background text-on-surface min-h-screen flex flex-col items-center justify-center overflow-hidden relative">
            {/* Playful Background Decoration (Organic Blobs) */}
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary opacity-5 blur-[120px] rounded-full"></div>
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-secondary opacity-10 blur-[120px] rounded-full"></div>
            <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-tertiary opacity-5 blur-[100px] rounded-full"></div>

            {/* Background Dot Pattern (Grid) */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
                <div className="grid grid-cols-12 gap-12 p-12 w-full h-full">
                    {Array.from({ length: 48 }).map((_, i) => (
                        <div key={i} className="tactile-dot mx-auto my-auto"></div>
                    ))}
                </div>
            </div>

            {/* Main Content Canvas */}
            <main className="relative z-10 w-full max-w-md px-6">
                {/* Logo Section */}
                <div className="flex flex-col items-center mb-12">
                    <div className="mb-6 relative">
                        {/* Abstract Logo Shape */}
                        <div className="w-24 h-24 bg-surface-container-highest rounded-xl flex items-center justify-center shadow-[40px_0_40px_rgba(43,42,81,0.06)] transform rotate-12">
                            <span className="material-symbols-outlined text-primary text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                                grid_view
                            </span>
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-secondary-container rounded-full flex items-center justify-center transform -rotate-12 border-4 border-background">
                            <span className="material-symbols-outlined text-on-secondary-container text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>
                                star
                            </span>
                        </div>
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-primary">Dots & Boxes</h1>
                    <p className="text-on-surface-variant text-sm font-medium">The Modern Tabletop Experience</p>
                </div>

                {/* Login Card */}
                <div className="glass-card p-8 rounded-xl shadow-[40px_0_40px_rgba(43,42,81,0.06)] border border-outline-variant/15">
                    <h2 className="text-xl font-bold text-on-surface mb-8 text-center">
                        {isLogin ? "Welcome Back" : "Create Account"}
                    </h2>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        {/* Username (only for create account) */}
                        {!isLogin && (
                            <div>
                                <label className="block text-sm font-medium text-on-surface mb-2">Username</label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Choose your username"
                                    className="w-full px-4 py-3 rounded-full border border-outline-variant/20 bg-surface-container-lowest text-on-surface placeholder-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest focus:border-primary transition-colors"
                                />
                            </div>
                        )}

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-on-surface mb-2">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your@email.com"
                                className="w-full px-4 py-3 rounded-full border border-outline-variant/20 bg-surface-container-lowest text-on-surface placeholder-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest focus:border-primary transition-colors"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-on-surface mb-2">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                className="w-full px-4 py-3 rounded-full border border-outline-variant/20 bg-surface-container-lowest text-on-surface placeholder-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest focus:border-primary transition-colors"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full flex items-center justify-center gap-3 bg-gradient-to-br from-primary to-primary-container text-on-primary py-4 px-6 rounded-full font-bold shadow-lg hover:brightness-110 active:scale-95 transition-all duration-150 mt-6"
                        >
                            <span>{isLogin ? "Login" : "Create Account"}</span>
                        </button>
                    </form>

                    {/* Toggle between login and signup */}
                    <div className="mt-8 pt-8 border-t border-outline-variant/10 text-center">
                        <p className="text-sm text-on-surface-variant">
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                            <button
                                onClick={() => setIsLogin(!isLogin)}
                                className="text-primary font-semibold hover:underline"
                            >
                                {isLogin ? "Create one" : "Login"}
                            </button>
                        </p>
                    </div>
                </div>

                {/* Decorative Board Piece (Asymmetric) */}
                <div className="absolute -bottom-24 -left-12 w-48 h-48 bg-surface-container-low rounded-xl transform -rotate-12 opacity-50 border border-outline-variant/10 -z-10 flex flex-col p-6 gap-4">
                    <div className="flex justify-between">
                        <div className="tactile-dot"></div>
                        <div className="tactile-dot"></div>
                    </div>
                    <div className="h-1 w-full bg-secondary opacity-30 rounded-full"></div>
                    <div className="flex justify-between">
                        <div className="tactile-dot"></div>
                        <div className="tactile-dot"></div>
                    </div>
                </div>

                {/* Secondary Decorative Piece */}
                <div className="absolute -top-12 -right-8 w-32 h-32 bg-secondary-container/20 rounded-xl transform rotate-45 opacity-40 -z-10 border border-outline-variant/10"></div>
            </main>

        </div>
    );
}

export default Login;
