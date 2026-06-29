import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserAvatarProps {
  name: string;
  photo_url?: string | null;
  className?: string;
}

export function UserAvatar({ name, photo_url, className = "" }: UserAvatarProps) {
  // Helper to get initials from the name (e.g. "João Silva" -> "JS")
  const getInitials = (name: string) => {
    const parts = name.split(" ").filter(Boolean);
    if (parts.length === 0) return "?";
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <Avatar className={className}>
      {photo_url && <AvatarImage src={photo_url} alt={name} className="object-cover" />}
      <AvatarFallback>{getInitials(name)}</AvatarFallback>
    </Avatar>
  );
}
