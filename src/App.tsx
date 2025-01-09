import { ChatLayout } from '@/components/chat/chat-layout';
import { ThemeProvider } from '@/components/theme-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="chat-theme">
      <TooltipProvider>
        <ChatLayout />
        <Toaster />
      </TooltipProvider>
    </ThemeProvider>
  );
}

export default App;