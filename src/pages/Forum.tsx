import { Navbar } from "@/components/navigation/navbar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Plus, Reply, User, Clock, ChevronRight, MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { getCurrentUser, type UserRole } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

interface ForumReply {
  id: string;
  content: string;
  author: string;
  authorRole: UserRole;
  createdAt: string;
  parentId?: string; // ID de la réponse parente (pour les réponses imbriquées)
  replies?: ForumReply[];
}

interface ForumTopic {
  id: string;
  title: string;
  content: string;
  author: string;
  authorRole: UserRole;
  createdAt: string;
  replies: ForumReply[];
  category?: string;
}

const FORUM_STORAGE_KEY = "forum:topics";

// Données initiales de démonstration
const initialTopics: ForumTopic[] = [
  {
    id: "topic-1",
    title: "Comment bien débuter avec JavaScript ?",
    content: "Je suis nouveau en programmation et je voudrais savoir par où commencer avec JavaScript. Quels sont les concepts de base à maîtriser en premier ?",
    author: "apprenant1@edu.local",
    authorRole: "student",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    category: "Cours et Formations",
    replies: [
      {
        id: "reply-1",
        content: "Je recommande de commencer par les bases : variables, fonctions, conditions, et boucles. Ensuite, vous pourrez passer aux objets et aux tableaux.",
        author: "formateur@edu.local",
        authorRole: "formateur",
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        replies: [
          {
            id: "reply-1-1",
            content: "Merci pour ces conseils ! Avez-vous des ressources à recommander ?",
            author: "apprenant1@edu.local",
            authorRole: "student",
            createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
            parentId: "reply-1",
          }
        ]
      },
      {
        id: "reply-2",
        content: "N'oubliez pas de pratiquer régulièrement ! Créez de petits projets pour appliquer ce que vous apprenez.",
        author: "apprenant2@edu.local",
        authorRole: "student",
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      }
    ]
  },
  {
    id: "topic-2",
    title: "Problème avec les quiz - Question sur les réponses multiples",
    content: "Bonjour, j'ai une question concernant le quiz de JavaScript. Pour la question sur les tableaux, plusieurs réponses semblent correctes. Comment dois-je procéder ?",
    author: "apprenant2@edu.local",
    authorRole: "student",
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    category: "Quiz et Évaluations",
    replies: [
      {
        id: "reply-3",
        content: "Pour les questions à choix multiples, vous devez sélectionner toutes les réponses correctes. Si plusieurs options sont vraies, cochez-les toutes.",
        author: "formateur@edu.local",
        authorRole: "formateur",
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      }
    ]
  },
  {
    id: "topic-3",
    title: "Meilleures pratiques pour organiser son code React",
    content: "En tant que formateur, j'aimerais partager quelques bonnes pratiques pour organiser son code React. Voici mes recommandations...",
    author: "formateur@edu.local",
    authorRole: "formateur",
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    category: "Cours et Formations",
    replies: []
  }
];

function getRoleLabel(role: UserRole): string {
  switch (role) {
    case "formateur":
      return "Formateur";
    case "student":
      return "Apprenant";
    case "admin":
      return "Administrateur";
    case "client":
      return "Collectivité locale";
    default:
      return "Utilisateur";
  }
}

function getRoleBadgeVariant(role: UserRole): "default" | "secondary" | "outline" {
  switch (role) {
    case "formateur":
      return "default";
    case "student":
      return "secondary";
    case "admin":
      return "outline";
    default:
      return "outline";
  }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "À l'instant";
  if (diffMins < 60) return `Il y a ${diffMins} min`;
  if (diffHours < 24) return `Il y a ${diffHours}h`;
  if (diffDays < 7) return `Il y a ${diffDays} jour${diffDays > 1 ? "s" : ""}`;
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}

function ReplyComponent({ 
  reply, 
  topicId, 
  onReply, 
  level = 0 
}: { 
  reply: ForumReply; 
  topicId: string; 
  onReply: (topicId: string, parentId: string, content: string) => void;
  level?: number;
}) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const user = getCurrentUser();
  const { toast } = useToast();

  const handleSubmitReply = () => {
    if (!replyContent.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir une réponse.",
        variant: "destructive",
      });
      return;
    }
    onReply(topicId, reply.id, replyContent);
    setReplyContent("");
    setShowReplyForm(false);
    toast({
      title: "Réponse publiée",
      description: "Votre réponse a été ajoutée avec succès.",
    });
  };

  const nestedReplies = reply.replies || [];

  return (
    <div className={`${level > 0 ? "ml-6 border-l-2 border-muted pl-4 mt-3" : ""}`}>
      <div className="bg-muted/30 rounded-lg p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{reply.author}</span>
            <Badge variant={getRoleBadgeVariant(reply.authorRole)} className="text-xs">
              {getRoleLabel(reply.authorRole)}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{formatDate(reply.createdAt)}</span>
          </div>
        </div>
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{reply.content}</p>
        {user && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="h-8 text-xs"
          >
            <Reply className="h-3 w-3 mr-1" />
            Répondre
          </Button>
        )}
        {showReplyForm && (
          <div className="space-y-2 pt-2 border-t">
            <Textarea
              placeholder="Écrivez votre réponse..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              rows={3}
              className="text-sm"
            />
            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={() => setShowReplyForm(false)}>
                Annuler
              </Button>
              <Button size="sm" onClick={handleSubmitReply} className="bg-gradient-primary">
                Publier
              </Button>
            </div>
          </div>
        )}
      </div>
      {nestedReplies.length > 0 && (
        <div className="mt-3 space-y-3">
          {nestedReplies.map((nestedReply) => (
            <ReplyComponent
              key={nestedReply.id}
              reply={nestedReply}
              topicId={topicId}
              onReply={onReply}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Forum() {
  const [topics, setTopics] = useState<ForumTopic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<ForumTopic | null>(null);
  const [isNewTopicOpen, setIsNewTopicOpen] = useState(false);
  const [newTopic, setNewTopic] = useState({ title: "", content: "", category: "" });
  const [replyContent, setReplyContent] = useState("");
  const user = getCurrentUser();
  const { toast } = useToast();

  // Charger les sujets depuis localStorage
  useEffect(() => {
    const stored = localStorage.getItem(FORUM_STORAGE_KEY);
    if (stored) {
      try {
        setTopics(JSON.parse(stored));
      } catch {
        setTopics(initialTopics);
      }
    } else {
      setTopics(initialTopics);
    }
  }, []);

  // Sauvegarder les sujets dans localStorage
  const saveTopics = (newTopics: ForumTopic[]) => {
    setTopics(newTopics);
    localStorage.setItem(FORUM_STORAGE_KEY, JSON.stringify(newTopics));
  };

  const handleCreateTopic = () => {
    if (!newTopic.title.trim() || !newTopic.content.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour créer un sujet.",
        variant: "destructive",
      });
      return;
    }

    const topic: ForumTopic = {
      id: `topic-${Date.now()}`,
      title: newTopic.title,
      content: newTopic.content,
      author: user.email,
      authorRole: user.role,
      createdAt: new Date().toISOString(),
      category: newTopic.category || undefined,
      replies: [],
    };

    const updatedTopics = [topic, ...topics];
    saveTopics(updatedTopics);
    setNewTopic({ title: "", content: "", category: "" });
    setIsNewTopicOpen(false);
    setSelectedTopic(topic);
    toast({
      title: "Sujet créé",
      description: "Votre sujet a été publié avec succès.",
    });
  };

  const handleReplyToTopic = (topicId: string) => {
    if (!replyContent.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir une réponse.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour répondre.",
        variant: "destructive",
      });
      return;
    }

    const reply: ForumReply = {
      id: `reply-${Date.now()}`,
      content: replyContent,
      author: user.email,
      authorRole: user.role,
      createdAt: new Date().toISOString(),
    };

    const updatedTopics = topics.map((topic) => {
      if (topic.id === topicId) {
        return { ...topic, replies: [...topic.replies, reply] };
      }
      return topic;
    });

    saveTopics(updatedTopics);
    setReplyContent("");
    if (selectedTopic?.id === topicId) {
      setSelectedTopic(updatedTopics.find((t) => t.id === topicId) || null);
    }
    toast({
      title: "Réponse publiée",
      description: "Votre réponse a été ajoutée avec succès.",
    });
  };

  const handleReplyToReply = (topicId: string, parentId: string, content: string) => {
    if (!user) return;

    const reply: ForumReply = {
      id: `reply-${Date.now()}`,
      content,
      author: user.email,
      authorRole: user.role,
      createdAt: new Date().toISOString(),
      parentId,
    };

    const addReplyToParent = (replies: ForumReply[]): ForumReply[] => {
      return replies.map((r) => {
        if (r.id === parentId) {
          return { ...r, replies: [...(r.replies || []), reply] };
        }
        if (r.replies) {
          return { ...r, replies: addReplyToParent(r.replies) };
        }
        return r;
      });
    };

    const updatedTopics = topics.map((topic) => {
      if (topic.id === topicId) {
        return { ...topic, replies: addReplyToParent(topic.replies) };
      }
      return topic;
    });

    saveTopics(updatedTopics);
    if (selectedTopic?.id === topicId) {
      setSelectedTopic(updatedTopics.find((t) => t.id === topicId) || null);
    }
  };

  const categories = [
    "Toutes les catégories",
    "Cours et Formations",
    "Quiz et Évaluations",
    "Cours en Live",
    "Problèmes Techniques",
    "Général",
  ];

  const [selectedCategory, setSelectedCategory] = useState("Toutes les catégories");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTopics = topics.filter((topic) => {
    const matchesCategory = selectedCategory === "Toutes les catégories" || topic.category === selectedCategory;
    const matchesSearch =
      topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (selectedTopic) {
    return (
      <div className="min-h-screen bg-gradient-secondary">
        <Navbar />
        <main className="container mx-auto px-4 py-8 space-y-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Button variant="ghost" size="sm" onClick={() => setSelectedTopic(null)}>
              <ChevronRight className="h-4 w-4 rotate-180 mr-1" />
              Retour au forum
            </Button>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <CardTitle className="text-2xl">{selectedTopic.title}</CardTitle>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{selectedTopic.author}</span>
                      <Badge variant={getRoleBadgeVariant(selectedTopic.authorRole)}>
                        {getRoleLabel(selectedTopic.authorRole)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{formatDate(selectedTopic.createdAt)}</span>
                    </div>
                    {selectedTopic.category && (
                      <Badge variant="outline">{selectedTopic.category}</Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted/30 rounded-lg p-4">
                <p className="whitespace-pre-wrap leading-relaxed">{selectedTopic.content}</p>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">
                    Réponses ({selectedTopic.replies.length})
                  </h3>
                </div>

                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-4">
                    {selectedTopic.replies.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Aucune réponse pour le moment.</p>
                        <p className="text-sm mt-2">Soyez le premier à répondre !</p>
                      </div>
                    ) : (
                      selectedTopic.replies.map((reply) => (
                        <ReplyComponent
                          key={reply.id}
                          reply={reply}
                          topicId={selectedTopic.id}
                          onReply={handleReplyToReply}
                        />
                      ))
                    )}
                  </div>
                </ScrollArea>

                {user && (
                  <div className="space-y-3 pt-4 border-t">
                    <h4 className="font-medium">Répondre à ce sujet</h4>
                    <Textarea
                      placeholder="Écrivez votre réponse..."
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      rows={4}
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setReplyContent("");
                          setSelectedTopic(null);
                        }}
                      >
                        Annuler
                      </Button>
                      <Button
                        onClick={() => handleReplyToTopic(selectedTopic.id)}
                        className="bg-gradient-primary"
                      >
                        Publier la réponse
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-secondary">
      <Navbar />
      <main className="container mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Forum de Discussions
            </h1>
            <p className="text-muted-foreground mt-2">
              Échangez avec les apprenants et les formateurs
            </p>
          </div>
          {user && (user.role === "student" || user.role === "formateur") && (
            <Dialog open={isNewTopicOpen} onOpenChange={setIsNewTopicOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau sujet
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Créer un nouveau sujet</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Titre du sujet"
                    value={newTopic.title}
                    onChange={(e) => setNewTopic({ ...newTopic, title: e.target.value })}
                  />
                  <div>
                    <label className="text-sm font-medium mb-2 block">Catégorie (optionnel)</label>
                    <Input
                      placeholder="Ex: Cours et Formations, Quiz et Évaluations..."
                      value={newTopic.category}
                      onChange={(e) => setNewTopic({ ...newTopic, category: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Contenu</label>
                    <Textarea
                      placeholder="Décrivez votre question ou votre sujet de discussion..."
                      value={newTopic.content}
                      onChange={(e) => setNewTopic({ ...newTopic, content: e.target.value })}
                      rows={6}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsNewTopicOpen(false)}>
                      Annuler
                    </Button>
                    <Button onClick={handleCreateTopic} className="bg-gradient-primary">
                      Publier le sujet
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <Input
            placeholder="Rechercher un sujet..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        {/* Topics List */}
        <div className="space-y-4">
          {filteredTopics.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">Aucun sujet trouvé.</p>
              </CardContent>
            </Card>
          ) : (
            filteredTopics.map((topic) => (
              <Card
                key={topic.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedTopic(topic)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <CardTitle className="text-lg">{topic.title}</CardTitle>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span>{topic.author}</span>
                          <Badge variant={getRoleBadgeVariant(topic.authorRole)} className="text-xs">
                            {getRoleLabel(topic.authorRole)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{formatDate(topic.createdAt)}</span>
                        </div>
                        {topic.category && (
                          <Badge variant="outline" className="text-xs">
                            {topic.category}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{topic.replies.length}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">{topic.content}</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

