import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AbsoluteFill,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useDelayRender,
  useVideoConfig
} from 'remotion';
import type { Caption } from '@remotion/captions';
import { createTikTokStyleCaptions } from '@remotion/captions';

const fadeIn = (frame: number, fps: number, start: number, duration: number) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

const slideUp = (frame: number, fps: number, start: number, distance: number) =>
  interpolate(frame, [start, start + 0.8 * fps], [distance, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

export const Promo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const [captions, setCaptions] = useState<Caption[] | null>(null);
  const { delayRender, continueRender, cancelRender } = useDelayRender();
  const [handle] = useState(() => delayRender());

  const fetchCaptions = useCallback(async () => {
    try {
      const response = await fetch(staticFile('remotion/captions.json'));
      const data = (await response.json()) as Caption[];
      setCaptions(data);
      continueRender(handle);
    } catch (e) {
      cancelRender(e);
    }
  }, [continueRender, cancelRender, handle]);

  useEffect(() => {
    fetchCaptions();
  }, [fetchCaptions]);

  const heroOpacity = fadeIn(frame, fps, 0, 1.2 * fps);
  const heroY = slideUp(frame, fps, 0, 30);

  const featureOpacity = fadeIn(frame, fps, 3 * fps, 1 * fps);
  const featureY = slideUp(frame, fps, 3 * fps, 24);

  const showcaseOpacity = fadeIn(frame, fps, 7 * fps, 1 * fps);
  const showcaseScale = spring({ frame: frame - 7 * fps, fps, config: { damping: 200 } });

  const ctaOpacity = fadeIn(frame, fps, 12 * fps, 0.8 * fps);
  const ctaY = slideUp(frame, fps, 12 * fps, 20);

  const zoom = interpolate(frame, [7 * fps, 12 * fps], [1, 1.04], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const pages = useMemo(() => {
    if (!captions) return null;
    return createTikTokStyleCaptions({
      captions,
      combineTokensWithinMilliseconds: 1200,
    }).pages;
  }, [captions]);

  const captionPages = useMemo(() => {
    if (!pages) return [];
    return pages.map((page, index) => {
      const next = pages[index + 1] ?? null;
      const startFrame = (page.startMs / 1000) * fps;
      const endFrame = Math.min(
        next ? (next.startMs / 1000) * fps : Infinity,
        startFrame + (1200 / 1000) * fps
      );
      const durationInFrames = endFrame - startFrame;
      return { page, startFrame, durationInFrames, index };
    }).filter(p => p.durationInFrames > 0);
  }, [pages, fps]);

  return (
    <AbsoluteFill style={{ backgroundColor: '#05070B' }}>
      {/* Background glow */}
      <AbsoluteFill
        style={{
          background: 'radial-gradient(1200px 600px at 15% 10%, rgba(70,130,180,0.25), transparent 60%)',
        }}
      />
      <AbsoluteFill
        style={{
          background: 'radial-gradient(900px 500px at 85% 15%, rgba(99,102,241,0.18), transparent 60%)',
        }}
      />

      {/* Subtle grid */}
      <AbsoluteFill
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          opacity: 0.2,
        }}
      />

      <AbsoluteFill style={{ padding: 120 }}>
        <Sequence from={0} durationInFrames={3 * fps} premountFor={1 * fps}>
          <div style={{ opacity: heroOpacity, transform: `translateY(${heroY}px)` }}>
            <div style={{ fontSize: 22, letterSpacing: 3, color: '#9CA3AF', marginBottom: 16 }}>SKILLS.SH</div>
            <div style={{ fontSize: 72, fontWeight: 700, color: '#FFFFFF', lineHeight: 1.05 }}>
              Skill Intelligence
              <br />
              for Agent Teams
            </div>
            <div style={{ fontSize: 22, color: '#CBD5F5', marginTop: 20, maxWidth: 760 }}>
              Track trending skills, hot releases, and team adoption in one real-time dashboard.
            </div>
          </div>
        </Sequence>

        <Sequence from={3 * fps} durationInFrames={4 * fps} premountFor={1 * fps}>
          <div style={{ opacity: featureOpacity, transform: `translateY(${featureY}px)` }}>
            <div style={{ display: 'flex', gap: 24, marginTop: 40 }}>
              {[
                { title: 'Trending Signals', body: 'See what’s gaining momentum in the last 24 hours.' },
                { title: 'Hot Skills', body: 'Spot the fastest-rising tools and frameworks.' },
                { title: 'Team Insights', body: 'Understand org adoption and top contributors.' },
              ].map((item) => (
                <div
                  key={item.title}
                  style={{
                    background: 'rgba(10,12,18,0.9)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 12,
                    padding: 20,
                    flex: 1,
                  }}
                >
                  <div style={{ fontSize: 18, color: '#E5E7EB', fontWeight: 600, marginBottom: 8 }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: 14, color: '#9CA3AF', lineHeight: 1.5 }}>{item.body}</div>
                </div>
              ))}
            </div>
          </div>
        </Sequence>

        <Sequence from={7 * fps} durationInFrames={5 * fps} premountFor={1 * fps}>
          <div style={{ opacity: showcaseOpacity }}>
            <div
              style={{
                marginTop: 30,
                transform: `scale(${1 + 0.04 * showcaseScale})`,
                transition: 'none',
              }}
            >
              <div
                style={{
                  background: 'rgba(12,16,24,0.95)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 16,
                  padding: 16,
                  width: width - 240,
                  height: height - 360,
                  boxShadow: '0 40px 120px rgba(0,0,0,0.35)',
                  overflow: 'hidden',
                }}
              >
                <Img
                  src={staticFile('remotion/site.png')}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transform: `scale(${zoom})`,
                  }}
                />
              </div>
            </div>
          </div>
        </Sequence>

        <Sequence from={12 * fps} durationInFrames={3 * fps} premountFor={1 * fps}>
          <div style={{ opacity: ctaOpacity, transform: `translateY(${ctaY}px)` }}>
            <div style={{ fontSize: 40, color: '#FFFFFF', fontWeight: 700 }}>Explore the Dashboard</div>
            <div style={{ fontSize: 20, color: '#9CA3AF', marginTop: 12 }}>
              Live insights at <span style={{ color: '#93C5FD' }}>skills.sh</span>
            </div>
          </div>
        </Sequence>

        {captionPages.map(({ page, startFrame, durationInFrames, index }) => (
          <Sequence key={index} from={startFrame} durationInFrames={durationInFrames} premountFor={1 * fps}>
            <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 80 }}>
              <div
                style={{
                  background: 'rgba(0,0,0,0.45)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: 12,
                  padding: '14px 18px',
                  maxWidth: 1200,
                  fontSize: 28,
                  lineHeight: 1.4,
                  color: '#FFFFFF',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {page.tokens.map((token) => {
                  const absoluteTimeMs = page.startMs + (frame / fps) * 1000;
                  const isActive = token.fromMs <= absoluteTimeMs && token.toMs > absoluteTimeMs;
                  return (
                    <span key={`${token.fromMs}-${token.text}`} style={{ color: isActive ? '#93C5FD' : '#FFFFFF' }}>
                      {token.text}
                    </span>
                  );
                })}
              </div>
            </AbsoluteFill>
          </Sequence>
        ))}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
