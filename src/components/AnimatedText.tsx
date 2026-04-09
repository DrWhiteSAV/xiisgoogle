import { motion } from 'motion/react';
import React from 'react';

// Mapping of some common emojis to their Noto Animated versions (hex codes)
// This is a subset, but we can expand it or use a generic converter
const NOTO_ANIMATED_MAPPING: Record<string, string> = {
  '😀': '1f600', '😃': '1f603', '😄': '1f604', '😁': '1f601', '😆': '1f606',
  '😅': '1f605', '🤣': '1f923', '😂': '1f602', '🙂': '1f642', '🙃': '1f643',
  '😉': '1f609', '😊': '1f60a', '😇': '1f607', '🥰': '1f970', '😍': '1f60d',
  '🤩': '1f929', '😘': '1f618', '😗': '1f617', '😚': '1f61a', '😙': '1f619',
  '😋': '1f60b', '😛': '1f61b', '😜': '1f61c', '🤪': '1f92a', '😝': '1f61d',
  '🤑': '1f911', '🤗': '1f917', '🤭': '1f92d', '🤫': '1f92b', '🤔': '1f914',
  '🤐': '1f910', '🤨': '1f928', '😐': '1f610', '😑': '1f611', '😶': '1f636',
  '😏': '1f60f', '😒': '1f612', '🙄': '1f644', '😬': '1f62c', '🤥': '1f925',
  '😌': '1f60c', '😔': '1f614', '😪': '1f62a', '🤤': '1f924', '😴': '1f634',
  '😷': '1f637', '🤒': '1f912', '🤕': '1f915', '🤢': '1f922', '🤮': '1f92e',
  '🤧': '1f927', '🥵': '1f975', '🥶': '1f976', '🥴': '1f974', '😵': '1f635',
  '🤯': '1f92f', '🤠': '1f920', '🥳': '1f973', '😎': '1f60e', '🤓': '1f913',
  '🧐': '1f9d0', '😕': '1f615', '😟': '1f61f', '🙁': '1f641', '☹️': '2639',
  '😮': '1f62e', '😯': '1f62f', '😲': '1f632', '😳': '1f633', '🥺': '1f97a',
  '😦': '1f626', '😧': '1f627', '😨': '1f628', '😰': '1f630', '😥': '1f625',
  '😢': '1f622', '😭': '1f62d', '😱': '1f631', '😖': '1f616', '😣': '1f623',
  '😞': '1f61e', '😓': '1f613', '😩': '1f629', '😫': '1f62b', '🥱': '1f971',
  '😤': '1f624', '😡': '1f621', '😠': '1f620', '🤬': '1f92c', '😈': '1f608',
  '👿': '1f47f', '💀': '1f480', '☠️': '2620', '💩': '1f4a9', '🤡': '1f921',
  '👹': '1f479', '👺': '1f47a', '👻': '1f47b', '👽': '1f47d', '👾': '1f47e',
  '🤖': '1f916', '😺': '1f63a', '😸': '1f638', '😻': '1f63b', '😼': '1f63c',
  '😽': '1f63d', '🙀': '1f640', '😿': '1f63f', '😾': '1f63e', '🙈': '1f648',
  '🙉': '1f649', '🙊': '1f64a', '💋': '1f48b', '💌': '1f48c', '💘': '1f498',
  '💝': '1f49d', '💖': '1f496', '💗': '1f497', '💓': '1f493', '💞': '1f49e',
  '💕': '1f495', '💟': '1f49f', '❣️': '2763', '💔': '1f494', '❤️': '2764',
  '🧡': '1f9e1', '💛': '1f49b', '💚': '1f49a', '💙': '1f499', '💜': '1f49c',
  '🤎': '1f90e', '🖤': '1f5a4', '🤍': '1f90f', '💯': '1f4af', '💢': '1f4a2',
  '💥': '1f4a5', '💫': '1f4ab', '💦': '1f4a6', '💨': '1f4a8', '🕳️': '1f573',
  '💣': '1f4a3', '💬': '1f4ac', '👁️‍🗨️': '1f441', '🗨️': '1f5e8', '🗯️': '1f5ef',
  '💭': '1f4ad', '💤': '1f4a4'
};

const getEmojiHex = (emoji: string) => {
  if (NOTO_ANIMATED_MAPPING[emoji]) return NOTO_ANIMATED_MAPPING[emoji];
  
  // Fallback: convert emoji to hex string
  const codes = [];
  for (const char of emoji) {
    const code = char.codePointAt(0);
    if (code) codes.push(code.toString(16));
  }
  return codes.join('_');
};

interface AnimatedEmojiProps {
  emoji: string;
  isLarge?: boolean;
}

export const AnimatedEmoji = ({ emoji, isLarge = false }: AnimatedEmojiProps) => {
  const hex = getEmojiHex(emoji);
  const src = `https://fonts.gstatic.com/s/e/notoemoji/latest/${hex}/512.webp`;

  return (
    <motion.span
      className="inline-block align-middle"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ 
        scale: 1, 
        opacity: 1,
        y: isLarge ? [0, -10, 0] : [0, -2, 0]
      }}
      whileHover={{ scale: 1.2 }}
      transition={{ 
        type: 'spring', 
        stiffness: 300, 
        damping: 15,
        delay: Math.random() * 0.5,
        y: {
          repeat: Infinity,
          duration: isLarge ? 2 : 1.5,
          ease: "easeInOut"
        }
      }}
    >
      <img 
        src={src} 
        alt={emoji} 
        className={isLarge ? "w-32 h-32" : "w-[1.2em] h-[1.2em] inline-block -mt-1"}
        onError={(e) => {
          // If animated version fails, show static emoji
          (e.target as HTMLImageElement).style.display = 'none';
          const parent = (e.target as HTMLElement).parentElement;
          if (parent) {
            const span = document.createElement('span');
            span.innerText = emoji;
            parent.appendChild(span);
          }
        }}
        referrerPolicy="no-referrer"
      />
    </motion.span>
  );
};

export const AnimatedText = ({ text, isLarge = false }: { text: string, isLarge?: boolean }) => {
  // Regex to find emojis (including those with modifiers)
  const emojiRegex = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g;
  
  const parts = text.split(emojiRegex);
  const matches = text.match(emojiRegex) || [];
  
  let matchIndex = 0;
  const result = [];
  
  for (let i = 0; i < parts.length; i++) {
    if (i % 2 === 1) {
      // This part is an emoji
      const emoji = matches[matchIndex++];
      if (emoji) {
        result.push(
          <React.Fragment key={i}>
            <AnimatedEmoji emoji={emoji} isLarge={isLarge} />
          </React.Fragment>
        );
      }
    } else if (parts[i]) {
      result.push(<span key={i}>{parts[i]}</span>);
    }
  }
  
  return <>{result}</>;
};
