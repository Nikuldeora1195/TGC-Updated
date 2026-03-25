"use client"

import { useEffect, useState } from "react"
import { HelpCircle, Send, MessageCircle, Clock, CheckCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

interface Query {
  id: string
  subject: string
  question: string
  status: string
  reply: string | null
  created_at: string
  replied_at: string | null
}

export default function HelpDeskPage() {
  const [queries, setQueries] = useState<Query[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [subject, setSubject] = useState("")
  const [question, setQuestion] = useState("")
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    fetchQueries()
  }, [])

  async function fetchQueries() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      const { data } = await supabase
        .from("queries")
        .select("*")
        .eq("member_id", user.id)
        .order("created_at", { ascending: false })

      setQueries(data || [])
    }
    setLoading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setSuccess(false)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return

    const { error } = await supabase.from("queries").insert({
      member_id: user.id,
      subject,
      question,
      status: "open",
    })

    if (!error) {
      setSubject("")
      setQuestion("")
      setSuccess(true)
      fetchQueries()
    }
    
    setSubmitting(false)
  }

  const statusColors: Record<string, string> = {
    open: "bg-yellow-500/20 text-yellow-400",
    answered: "bg-green-500/20 text-green-400",
    closed: "bg-gray-500/20 text-gray-400",
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
        <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Help Desk</h1>
        <p className="mt-1 text-muted-foreground">
          Have a question? Submit a query and our team will get back to you.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Submit Query Form */}
        <Card>
          <CardHeader>
            <CardTitle>Submit a Query</CardTitle>
            <CardDescription>
              Fill out the form below and we&apos;ll respond as soon as possible.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {success && (
                <div className="rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400">
                  Your query has been submitted successfully!
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="Brief description of your question"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="question">Your Question</Label>
                <Textarea
                  id="question"
                  placeholder="Please provide details about your query..."
                  rows={5}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  required
                />
              </div>
              
              <Button type="submit" disabled={submitting} className="w-full">
                {submitting ? (
                  "Submitting..."
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Submit Query
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* My Queries */}
        <Card>
          <CardHeader>
            <CardTitle>My Queries</CardTitle>
            <CardDescription>
              Track the status of your submitted queries.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {queries.length > 0 ? (
              <div className="space-y-4">
                {queries.map((query) => (
                  <div
                    key={query.id}
                    className="rounded-lg border border-border p-4"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-medium text-foreground">{query.subject}</h4>
                      <Badge className={statusColors[query.status]}>
                        {query.status === "open" && <Clock className="mr-1 h-3 w-3" />}
                        {query.status === "answered" && <CheckCircle className="mr-1 h-3 w-3" />}
                        {query.status}
                      </Badge>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                      {query.question}
                    </p>
                    {query.reply && (
                      <div className="mt-3 rounded-lg bg-primary/5 p-3">
                        <p className="text-xs font-medium text-primary">Reply:</p>
                        <p className="mt-1 text-sm text-foreground">{query.reply}</p>
                      </div>
                    )}
                    <p className="mt-2 text-xs text-muted-foreground">
                      Submitted on {new Date(query.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center py-8 text-center">
                <MessageCircle className="h-10 w-10 text-muted-foreground" />
                <p className="mt-3 text-sm text-muted-foreground">
                  You haven&apos;t submitted any queries yet.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
