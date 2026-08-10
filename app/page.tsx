import Image from 'next/image'
import Link from 'next/link'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { BookOpen, Award, Globe, Shield, ChevronRight, Star, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect('/dashboard')

  // Use service-role client to bypass RLS — programs are public content
  const adminDb = createAdminClient()
  const { data: programs } = await adminDb
    .from('programs')
    .select('id, title, description, price_cents, duration_weeks, level')
    .eq('is_published', true)
    .order('created_at', { ascending: true })
    .limit(6)

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans">
      {/* NAV */}
      <header className="sticky top-0 z-50 border-b border-primary/20 bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <Image src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Aug%206%2C%202026%2C%2003_08_50%20PM-90soxHyLHqGFp3wNGrmkrGydAqqFzT.png" alt="LinguaBridge logo" width={44} height={44} className="rounded-lg" priority />
            <div className="hidden sm:block">
              <p className="text-xs font-bold uppercase tracking-widest text-accent">LinguaBridge</p>
              <p className="text-[10px] text-primary-foreground/50 leading-tight">Translations &amp; Short Courses</p>
            </div>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="/programs" className="text-sm text-primary-foreground/70 hover:text-accent transition-colors">Programs</Link>
            <Link href="#how-it-works" className="text-sm text-primary-foreground/70 hover:text-accent transition-colors">How It Works</Link>
            <Link href="/faq" className="text-sm text-primary-foreground/70 hover:text-accent transition-colors">FAQ</Link>
            <Link href="/verify" className="text-sm text-primary-foreground/70 hover:text-accent transition-colors">Verify Certificate</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" className="text-primary-foreground hover:text-accent hover:bg-white/10 text-sm">
              <Link href="/auth/login">Sign In</Link>
            </Button>
            <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90 text-sm font-semibold">
              <Link href="/auth/register">Enroll Now</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative bg-primary text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <Image src="/images/linguabridge/translation-hero.png" alt="Multilingual documents prepared for urgent translation" fill className="object-cover" priority />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/70 to-primary" />
        <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="animate-fade-in-up text-4xl font-bold leading-tight tracking-tight text-balance md:text-5xl lg:text-6xl">
              Urgent Translations. Practical Courses. Global Connections.
            </h1>
            <p className="animate-fade-in-up animate-delay-200 mt-6 text-lg leading-relaxed text-primary-foreground/90 text-pretty">
              LinguaBridge provides fast, reliable document translations when timing matters, alongside practical short courses that help you grow with confidence.
            </p>
            <div className="animate-fade-in-up animate-delay-400 mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold px-10 hover-lift">
                <Link href="/auth/register">Get Started</Link>
              </Button>
              <Button asChild size="lg" className="border border-white/50 bg-transparent text-primary-foreground hover:bg-white/10 hover-lift">
                <Link href="#programs">Browse Programs <ChevronRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="mx-auto grid max-w-7xl grid-cols-2 md:grid-cols-4">
            {[
              { label: 'Languages Supported', value: '30+' },
              { label: 'Translation Requests', value: '5,000+' },
              { label: 'Countries Reached', value: '40+' },
              { label: 'Short Courses', value: '20+' },
            ].map((stat, i) => (
              <div key={stat.label} className={`animate-fade-in-up animate-delay-${(i + 1) * 100} flex flex-col items-center border-r border-white/10 last:border-r-0 py-8 text-center`}>
                <span className="text-3xl font-bold text-accent">{stat.value}</span>
                <span className="mt-1 text-xs text-primary-foreground/50 uppercase tracking-wide">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY LINGUABRIDGE */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/30">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-bold text-primary">Language Support That Moves With You</h2>
            <p className="mt-3 text-muted-foreground">Fast translations and flexible learning for work, study, and life</p>
          </div>
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Feature Cards */}
            <div className="grid gap-8 md:grid-cols-2">
              {[
                { icon: BookOpen, title: 'Expert-Crafted Content', desc: 'Professional curriculum developed and refined by domain experts with rigorous quality assurance.' },
                { icon: Award, title: 'Verifiable Certificates', desc: 'Every certificate carries a unique ID instantly verifiable on our public portal.' },
                { icon: Globe, title: 'Learn Anywhere', desc: 'Fully self-paced and accessible on any device from any country, 24/7.' },
                { icon: Shield, title: 'Quality Assured', desc: 'Clear service standards, careful review, and transparent processes from first request to final delivery.' },
              ].map(({ icon: Icon, title, desc }, i) => (
                <div key={title} className={`animate-fade-in-up animate-delay-${i * 100} flex flex-col gap-4 rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md hover-lift transition-all`}>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                    <Icon className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-semibold text-foreground">{title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{desc}</p>
                </div>
              ))}
            </div>
            {/* Visual */}
            <div className="relative rounded-2xl overflow-hidden shadow-lg border border-border image-zoom">
              <Image src="/images/linguabridge/translator-at-work.png" alt="Professional translator reviewing multilingual documents" width={600} height={500} className="w-full h-full object-cover" priority />
            </div>
          </div>
        </div>
      </section>

      {/* PROGRAMS */}
      <section id="programs" className="bg-muted/40 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-bold text-primary">Short Courses</h2>
            <p className="mt-3 text-muted-foreground">Practical, self-paced learning built for busy professionals</p>
            <Link href="/programs" className="inline-flex items-center gap-2 mt-4 text-primary hover:text-primary/80 transition-colors text-sm font-medium">
              Browse All Programs
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
            {programs && programs.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {programs.map((program, i) => {
                  const priceInUSD = program.price_cents === 0 ? 0 : Math.round((program.price_cents / 100) / 134)
                  return (
                  <div key={program.id} className="group relative rounded-xl border border-border bg-card p-6 hover:border-primary/50 transition-colors">
                    <h3 className="font-semibold text-foreground text-lg">{program.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{program.description}</p>
                    <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                      <div>
                        <p className="text-2xl font-bold text-primary">
                          {program.price_cents === 0 ? 'Free' : `USD ${priceInUSD.toLocaleString()}`}
                        </p>
                        <p className="text-xs text-muted-foreground">one-time payment</p>
                      </div>
                      <Button asChild size="sm" className="group-hover:bg-primary/90">
                        <Link href={`/dashboard/programs/${program.id}/enroll`}>Enroll</Link>
                      </Button>
                    </div>
                  </div>
                )
                })}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 py-20 text-center text-muted-foreground">
              <BookOpen className="h-14 w-14 opacity-20" />
              <p className="text-sm">Programs are being prepared. Check back shortly.</p>
            </div>
          )}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-20 bg-muted/40">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-bold text-primary">How It Works</h2>
            <p className="mt-3 text-muted-foreground">From registration to certified professional in four steps</p>
          </div>
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            {/* Steps */}
            <div className="grid gap-10 md:grid-cols-2">
              {[
                { step: '01', title: 'Register & Enroll', desc: 'Create your account and enroll in your chosen certification program.' },
                { step: '02', title: 'Learn at Your Pace', desc: 'Access professionally designed lessons organised by module. Study on any device, anytime.' },
                { step: '03', title: 'Pass Assessments', desc: 'Complete module quizzes and a final exam to demonstrate your mastery.' },
                { step: '04', title: 'Get Certified', desc: 'Receive a verifiable digital certificate with a unique LinguaBridge ID upon completion.' },
              ].map(({ step, title, desc }, i) => (
                <div key={step} className={`animate-fade-in-up animate-delay-${i * 100} flex flex-col items-start text-left gap-4 p-6 rounded-xl bg-background border border-border hover-lift transition-all`}>
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-accent bg-primary text-accent font-bold text-lg">
                    {step}
                  </div>
                  <h3 className="font-semibold text-foreground">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
            {/* Visual */}
            <div className="relative rounded-2xl overflow-hidden shadow-lg border border-border h-96 image-zoom">
              <Image src="/images/linguabridge/short-course-learning.png" alt="Professional learner studying a LinguaBridge short course" width={600} height={500} className="w-full h-full object-cover" priority />
            </div>
          </div>
        </div>
      </section>

      {/* QUALITY PRACTICES */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-primary/10 border-b border-primary/20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-primary">Quality You Can See</h2>
            <p className="mt-3 text-muted-foreground">Clear processes, careful review, and practical learning built for international audiences.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { title: 'Human-reviewed translations', desc: 'Documents are handled with care and reviewed for meaning, tone, and context before delivery.' },
              { title: 'Transparent learning', desc: 'Short courses set clear outcomes, structured lessons, and practical assessments from the start.' },
              { title: 'Secure delivery', desc: 'We keep communication focused, professional, and designed around the needs of each client.' },
            ].map(({ title, desc }) => (
              <div key={title} className="rounded-xl border border-border bg-card p-7 shadow-sm">
                <CheckCircle className="mb-5 h-7 w-7 text-accent" />
                <h3 className="text-lg font-semibold text-primary">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INTERNATIONAL QUALITY */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/30">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-bold text-primary">International Quality Standards</h2>
            <p className="mt-3 text-muted-foreground">A practical quality framework for language services and short-course learning.</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { icon: Globe, label: 'Global context', title: 'Built for international audiences', desc: 'Our services are designed to help people communicate, study, and work across borders.' },
              { icon: Shield, label: 'Careful review', title: 'Quality through attention to detail', desc: 'We focus on accuracy, clarity, consistency, and a professional experience at every step.' },
              { icon: BookOpen, label: 'Practical learning', title: 'Courses with useful outcomes', desc: 'Short courses are structured around accessible lessons and skills learners can apply in real life.' },
            ].map(({ icon: Icon, label, title, desc }, i) => (
              <div key={title} className={`animate-fade-in-up animate-delay-${i * 100} rounded-xl border border-border bg-card p-8 shadow-sm hover:shadow-md hover-lift transition-all`}>
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex size-12 items-center justify-center rounded-lg bg-primary text-accent">
                    <Icon className="size-6" />
                  </div>
                  <Badge variant="outline" className="border-primary/20 text-primary">{label}</Badge>
                </div>
                <h3 className="text-lg font-semibold text-foreground">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 rounded-xl border border-primary/20 bg-primary/5 p-8 text-center">
            <p className="mx-auto max-w-3xl text-sm leading-relaxed text-muted-foreground">LinguaBridge keeps its service promise simple: communicate clearly, review carefully, and make language support more accessible across the world.</p>
          </div>
        </div>
      </section>

      {/* EXTERNAL REVIEW REFERENCE */}
      <section className="relative bg-primary py-20 text-primary-foreground overflow-hidden">
        <div className="mx-auto max-w-3xl px-6 relative z-10 text-center">
          <div className="mx-auto mb-6 flex size-14 items-center justify-center rounded-full bg-accent/15 text-accent">
            <Star className="size-7 fill-accent" />
          </div>
          <h2 className="text-3xl font-bold">Explore Independent Language-Service Reviews</h2>
          <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-primary-foreground/80">
            We believe trust starts with transparency. Explore independent language-service reviews on Trustpilot as an external industry reference, separate from LinguaBridge.
          </p>
          <Button asChild size="lg" className="mt-8 bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
            <a href="https://www.trustpilot.com/review/iq-lingua.de" target="_blank" rel="noreferrer">
              View us on Trustpilot <ChevronRight className="ml-2 size-4" />
            </a>
          </Button>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-br from-primary via-primary/95 to-primary text-primary-foreground">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <Badge className="mb-6 mx-auto bg-accent/20 text-accent border-accent/30 text-xs tracking-widest uppercase px-4 py-1 w-fit">
            Limited Time Offer
          </Badge>
          <h2 className="text-4xl font-bold leading-tight md:text-5xl">Ready to Advance Your Career?</h2>
          <p className="mt-6 text-lg text-primary-foreground/80 leading-relaxed">Get the language support you need today, or build your next skill through a flexible LinguaBridge short course.</p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold px-10">
              <Link href="/auth/register">Create Free Account</Link>
            </Button>
            <Button asChild size="lg" className="border border-white/50 bg-transparent text-primary-foreground hover:bg-white/10">
              <Link href="/verify">Verify a Certificate</Link>
            </Button>
          </div>
        </div>
      </section>

    </div>
  )
}
