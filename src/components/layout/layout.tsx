import { useState } from 'react'
import Link from 'next/link'
import { Menu, User, X } from 'lucide-react'
import { Button } from "@/components/ui/button"

const menuItems = [
    { name: 'Home', href: '/' },
    { name: 'Write', href: '/write' },
]

export default function Layout({ children }: { children: React.ReactNode }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    return (
        <div className="min-h-screen flex flex-col">
            <header className="bg-background shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        {/* Logo */}
                        <div className="flex-shrink-0">
                            <Link href="/" className="text-2xl font-bold text-primary">
                                Logo
                            </Link>
                        </div>

                        {/* Desktop Menu */}
                        <nav className="hidden md:flex space-x-4">
                            {menuItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="text-muted-foreground hover:text-foreground"
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </nav>

                        {/* User Login Button */}
                        <div className="hidden md:flex items-center">
                            <Button variant="outline" size="sm" className="ml-4">
                                <User className="h-4 w-4 mr-2" />
                                Login
                            </Button>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            >
                                {isMobileMenuOpen ? (
                                    <X className="h-6 w-6" />
                                ) : (
                                    <Menu className="h-6 w-6" />
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    {isMobileMenuOpen && (
                        <div className="md:hidden py-2">
                            {menuItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="block py-2 text-muted-foreground hover:text-foreground"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            ))}
                            <Button variant="outline" size="sm" className="mt-2 w-full">
                                <User className="h-4 w-4 mr-2" />
                                Login
                            </Button>
                        </div>
                    )}
                </div>
            </header>

            {/* Content Area */}
            <main className="flex-grow bg-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {children}
                </div>
            </main>
        </div>
    )
}