export function Footer() {
    return (
        <footer className="border-t bg-background/95 backdrop-blur-md">
            <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
                <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
                    <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                        Built with ❤️ using Next.js 14 and TailwindCSS.
                    </p>
                </div>
                <div className="flex gap-4 text-secondary text-sm">
                    <a href="#" className="hover:underline hover:text-primary transition-colors">Privacy</a>
                    <a href="#" className="hover:underline hover:text-primary transition-colors">Terms</a>
                    <a href="#" className="hover:underline hover:text-primary transition-colors">Contact</a>
                </div>
            </div>
        </footer>
    );
}
