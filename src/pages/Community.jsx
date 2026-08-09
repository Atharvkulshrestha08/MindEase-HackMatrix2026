import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, X, MessageCircleHeart } from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { Textarea } from '../components/ui/Input'
import useLocalStorage from '../hooks/useLocalStorage'
import { useToast } from '../hooks/useToast'

const tags = ['achievement', 'gratitude', 'encouragement', 'question']

const getRelativeTime = (timestamp) => {
  if (!timestamp) return 'Just now'
  
  // If it's a string like "2h ago", return it directly (for legacy mock data)
  if (typeof timestamp === 'string') return timestamp

  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
  const daysDifference = Math.round((timestamp - Date.now()) / (1000 * 60 * 60 * 24))
  
  if (Math.abs(daysDifference) > 0) {
    return rtf.format(daysDifference, 'day')
  }
  
  const hoursDifference = Math.round((timestamp - Date.now()) / (1000 * 60 * 60))
  if (Math.abs(hoursDifference) > 0) {
    return rtf.format(hoursDifference, 'hour')
  }
  
  const minutesDifference = Math.round((timestamp - Date.now()) / (1000 * 60))
  if (Math.abs(minutesDifference) > 0) {
    return rtf.format(minutesDifference, 'minute')
  }
  
  return 'Just now'
}

const Community = () => {
  const [posts, setPosts] = useLocalStorage('communityPosts', [], v => Array.isArray(v))
  const [showNewPost, setShowNewPost] = useState(false)
  const [newPostContent, setNewPostContent] = useState('')
  const [newPostTag, setNewPostTag] = useState('achievement')
  const [filterTag, setFilterTag] = useState(null)
  const { showToast } = useToast()

  const handlePost = () => {
    if (!newPostContent.trim()) return
    setPosts([{ id: Date.now(), content: newPostContent, reactions: { '❤️': 0, '🌱': 0, '✨': 0 }, timestamp: Date.now(), tag: newPostTag }, ...posts])
    setNewPostContent('')
    setShowNewPost(false)
    showToast('Post shared with the community 💚', 'success')
  }

  const handleReaction = (postId, emoji) => {
    setPosts(posts.map(p => p.id === postId ? { ...p, reactions: { ...p.reactions, [emoji]: (p.reactions[emoji] || 0) + 1 } } : p))
  }

  const filteredPosts = filterTag ? posts.filter(p => p.tag === filterTag) : posts

  const getTagColor = (tag) => {
    const colors = { achievement: 'var(--secondary)', gratitude: 'var(--primary)', encouragement: 'var(--tertiary)', question: 'var(--on-surface-variant)' }
    return colors[tag] || 'var(--on-surface-variant)'
  }

  return (
    <div className="max-w-4xl mx-auto" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ fontFamily: 'var(--font-heading)', color: 'var(--on-surface)' }}>Community</h1>
          <p className="text-lg" style={{ color: 'var(--on-surface-variant)' }}>A safe space for anonymous encouragement</p>
        </div>
        <Button onClick={() => setShowNewPost(true)} icon={Plus}>Share</Button>
      </div>

      <div className="flex flex-wrap gap-2">
        <button onClick={() => setFilterTag(null)}
          className="px-4 py-2 rounded-full text-sm font-medium transition-colors"
          style={{ backgroundColor: !filterTag ? 'var(--primary)' : 'var(--surface-container)', color: !filterTag ? 'var(--on-primary)' : 'var(--on-surface-variant)' }}>All</button>
        {tags.map((tag) => (
          <button key={tag} onClick={() => setFilterTag(filterTag === tag ? null : tag)}
            className="px-4 py-2 rounded-full text-sm font-medium transition-colors"
            style={{ backgroundColor: filterTag === tag ? 'var(--primary)' : 'var(--surface-container)', color: filterTag === tag ? 'var(--on-primary)' : 'var(--on-surface-variant)' }}>#{tag}</button>
        ))}
      </div>

      {showNewPost && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setShowNewPost(false)}>
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} onClick={(e) => e.stopPropagation()}>
            <Card padding="lg" className="max-w-md w-full">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-2xl font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--on-surface)' }}>Share Something</h2>
                <button onClick={() => setShowNewPost(false)} style={{ color: 'var(--on-surface-variant)' }}><X size={22} /></button>
              </div>
              <Textarea placeholder="Share your thoughts..." value={newPostContent} onChange={(e) => setNewPostContent(e.target.value)} className="mb-5" />
              <div className="flex flex-wrap gap-2 mb-5">
                {tags.map((tag) => (
                  <button key={tag} onClick={() => setNewPostTag(tag)}
                    className="px-3 py-1.5 rounded-full text-sm transition-colors"
                    style={{ backgroundColor: newPostTag === tag ? 'var(--primary)' : 'var(--surface-container)', color: newPostTag === tag ? 'var(--on-primary)' : 'var(--on-surface-variant)' }}>#{tag}</button>
                ))}
              </div>
              <p className="text-xs mb-5" style={{ color: 'var(--on-surface-variant)' }}>Your post will be anonymous.</p>
              <Button onClick={handlePost} fullWidth disabled={!newPostContent.trim()}>Post Anonymously</Button>
            </Card>
          </motion.div>
        </motion.div>
      )}

      <div className="flex flex-col gap-4">
        {filteredPosts.length === 0 && (
          <Card padding="lg" className="text-center py-12">
            <MessageCircleHeart size={48} style={{ color: 'var(--on-surface-variant)', margin: '0 auto' }} strokeWidth={1.5} />
            <h3 className="text-xl font-bold mt-5 mb-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--on-surface)' }}>No posts here yet</h3>
            <p className="mb-5" style={{ color: 'var(--on-surface-variant)' }}>
              {filterTag ? `No #${filterTag} posts yet — be the first to start the conversation.` : 'Be the first to share a word of encouragement.'}
            </p>
            <Button variant="outline" onClick={() => setShowNewPost(true)} icon={Plus}>Share something</Button>
          </Card>
        )}
        {filteredPosts.map((post, index) => (
          <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
            <Card padding="md">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                    style={{ backgroundColor: 'color-mix(in srgb, var(--primary-container) 30%, transparent)' }}>🌟</div>
                  <div>
                    <span className="font-semibold text-sm" style={{ color: 'var(--on-surface)' }}>Anonymous</span>
                    <span className="text-xs block" style={{ color: 'var(--on-surface-variant)' }}>{getRelativeTime(post.timestamp || post.timeAgo)}</span>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{ backgroundColor: `color-mix(in srgb, ${getTagColor(post.tag)} 15%, transparent)`, color: getTagColor(post.tag) }}>#{post.tag}</span>
              </div>
              <p className="mb-5 leading-relaxed" style={{ color: 'var(--on-surface)' }}>{post.content}</p>
              <div className="flex items-center gap-3">
                {Object.entries(post.reactions).map(([emoji, count]) => (
                  <button key={emoji} onClick={() => handleReaction(post.id, emoji)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full transition-colors"
                    style={{ backgroundColor: 'var(--surface-container)' }}>
                    <span>{emoji}</span><span className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>{count}</span>
                  </button>
                ))}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default Community
