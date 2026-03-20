"use client"

import { useEffect, useState } from "react"
import { Clock, CheckCircle, MessageCircle, Send } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Query {
  id: string
  subject: string
  question: string
  status: string
  reply: string | null
  created_at: string
  member_id: string
  members: { name: string; email: string; member_id: string } | null
}

export default function QueriesPage() {
  const [queries, setQueries] = useState<Query[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null)
  const [reply, setReply] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchQueries()
  }, [])

  async function fetchQueries() {
    const supabase = createClient()
    setError(null)

    const { data: queriesData, error: queriesError } = await supabase
      .from("queries")
      .select("*")
      .order("created_at", { ascending: false })

    if (queriesError) {
      setError(queriesError.message)
      setQueries([])
      setLoading(false)
      return
    }

    const memberIds = Array.from(
      new Set((queriesData || []).map((query) => query.member_id).filter(Boolean))
    )

    let membersMap = new Map<string, { name: string; email: string; member_id: string }>()

    if (memberIds.length > 0) {
      const { data: membersData, error: membersError } = await supabase
        .from("members")
        .select("id, name, email, member_id")
        .in("id", memberIds)

      if (membersError) {
        setError(membersError.message)
      } else {
        membersMap = new Map(
          (membersData || []).map((member) => [
            member.id,
            {
              name: member.name,
              email: member.email,
              member_id: member.member_id,
            },
          ])
        )
      }
    }

    const mergedQueries = (queriesData || []).map((query) => ({
      ...query,
      members: membersMap.get(query.member_id) || null,
    }))

    setQueries(mergedQueries)
    setLoading(false)
  }

  async function handleReply(queryId: string) {
    if (!reply.trim()) return
    setSubmitting(true)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { error } = await supabase
      .from("queries")
      .update({
        reply,
        status: "answered",
        replied_by: user?.id,
        replied_at: new Date().toISOString(),
      })
      .eq("id", queryId)

    if (!error) {
      setReply("")
      setSelectedQuery(null)
      fetchQueries()
    } else {
      setError(error.message)
    }
    setSubmitting(false)
  }

  const openQueries = queries.filter((q) => q.status === "open")
  const answeredQueries = queries.filter((q) => q.status === "answered")

  const statusColors: Record<string, string> = {
    open: "bg-yellow-500/20 text-yellow-400",
    answered: "bg-green-500/20 text-green-400",
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Queries</h1>
        <p className="mt-1 text-muted-foreground">
          Manage and respond to member queries.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <Tabs defaultValue="open">
        <TabsList>
          <TabsTrigger value="open" className="gap-2">
            <Clock className="h-4 w-4" />
            Open ({openQueries.length})
          </TabsTrigger>
          <TabsTrigger value="answered" className="gap-2">
            <CheckCircle className="h-4 w-4" />
            Answered ({answeredQueries.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="open" className="mt-6">
          {openQueries.length > 0 ? (
            <div className="space-y-4">
              {openQueries.map((query) => (
                <Card key={query.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{query.subject}</CardTitle>
                        <CardDescription>
                          from {query.members?.name || "Unknown"} ({query.members?.member_id})
                        </CardDescription>
                      </div>
                      <Badge className={statusColors[query.status]}>
                        <Clock className="mr-1 h-3 w-3" />
                        {query.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-foreground">{query.question}</p>
                    <p className="text-xs text-muted-foreground">
                      Submitted on {new Date(query.created_at).toLocaleDateString()}
                    </p>

                    {selectedQuery?.id === query.id ? (
                      <div className="space-y-3 border-t border-border pt-4">
                        <Textarea
                          placeholder="Write your reply..."
                          value={reply}
                          onChange={(e) => setReply(e.target.value)}
                          rows={3}
                        />
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleReply(query.id)}
                            disabled={submitting || !reply.trim()}
                          >
                            {submitting ? "Sending..." : (
                              <>
                                <Send className="mr-2 h-4 w-4" />
                                Send Reply
                              </>
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setSelectedQuery(null)
                              setReply("")
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        onClick={() => setSelectedQuery(query)}
                      >
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Reply
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-10 text-center text-muted-foreground">
                No open queries at the moment.
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="answered" className="mt-6">
          {answeredQueries.length > 0 ? (
            <div className="space-y-4">
              {answeredQueries.map((query) => (
                <Card key={query.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{query.subject}</CardTitle>
                        <CardDescription>
                          from {query.members?.name || "Unknown"}
                        </CardDescription>
                      </div>
                      <Badge className={statusColors[query.status]}>
                        <CheckCircle className="mr-1 h-3 w-3" />
                        {query.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-foreground">{query.question}</p>
                    {query.reply && (
                      <div className="rounded-lg bg-primary/5 p-4">
                        <p className="text-xs font-medium text-primary mb-2">Your Reply:</p>
                        <p className="text-sm text-foreground">{query.reply}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-10 text-center text-muted-foreground">
                No answered queries yet.
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
