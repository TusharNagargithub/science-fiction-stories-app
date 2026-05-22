import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { imageUrl } from '../../core/image.util';
import { BrainQuestItem, StoryDetail, WordExploreItem } from '../../models/story.model';
import { StoryService } from '../../services/story.service';

type TabKey = 'word-explorer' | 'story-adventure' | 'brain-quest';

@Component({
  selector: 'app-story-detail',
  templateUrl: './story-detail.component.html',
  styleUrl: './story-detail.component.scss',
})
export class StoryDetailComponent implements OnInit {
  story: StoryDetail | null = null;
  loading = true;
  error = '';

  activeTab: TabKey = 'word-explorer';
  currentWordIndex = 0;

  matchedWordIds = new Set<string>();
  shakeWordId: string | null = null;

  quizAnswers: Record<string, string> = {};
  quizFeedback: Record<string, 'correct' | 'incorrect' | null> = {};

  readonly tabs: { key: TabKey; label: string; icon: string }[] = [
    { key: 'word-explorer', label: 'Word Explorer', icon: '🔍' },
    { key: 'story-adventure', label: 'Story Adventure', icon: '📖' },
    { key: 'brain-quest', label: 'Brain Quest', icon: '🧠' },
  ];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly storyService: StoryService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error = 'Story not found.';
      this.loading = false;
      return;
    }

    this.storyService.getStoryById(id).subscribe({
      next: (story) => {
        this.story = story;
        this.loading = false;
      },
      error: () => {
        this.error = 'Unable to load story details.';
        this.loading = false;
      },
    });
  }

  get currentWord(): WordExploreItem | null {
    if (!this.story?.wordExplore.length) {
      return null;
    }
    return this.story.wordExplore[this.currentWordIndex] ?? null;
  }

  get titleParts(): { prefix: string; highlight: string } {
    const title = this.story?.title ?? '';
    const words = title.split(' ');
    if (words.length <= 2) {
      return { prefix: '', highlight: title };
    }
    const highlight = words.slice(-2).join(' ');
    const prefix = words.slice(0, -2).join(' ');
    return { prefix, highlight };
  }

  imageUrl = imageUrl;

  setTab(tab: TabKey): void {
    this.activeTab = tab;
  }

  previousWord(): void {
    if (!this.story?.wordExplore.length) {
      return;
    }
    this.currentWordIndex =
      (this.currentWordIndex - 1 + this.story.wordExplore.length) % this.story.wordExplore.length;
  }

  nextWord(): void {
    if (!this.story?.wordExplore.length) {
      return;
    }
    this.currentWordIndex = (this.currentWordIndex + 1) % this.story.wordExplore.length;
  }

  isMatched(word: WordExploreItem): boolean {
    return this.matchedWordIds.has(this.wordKey(word));
  }

  onImageDrop(event: CdkDragDrop<WordExploreItem[]>, targetWord: WordExploreItem): void {
    const dragged = event.item.data as WordExploreItem;
    const draggedKey = this.wordKey(dragged);
    const targetKey = this.wordKey(targetWord);

    if (draggedKey === targetKey) {
      this.matchedWordIds.add(targetKey);
      this.shakeWordId = null;
      return;
    }

    this.shakeWordId = targetKey;
    setTimeout(() => {
      if (this.shakeWordId === targetKey) {
        this.shakeWordId = null;
      }
    }, 500);
  }

  selectQuizAnswer(question: BrainQuestItem, option: string): void {
    const key = question.id ?? question.question;
    this.quizAnswers[key] = option;
    this.quizFeedback[key] = option === question.answer ? 'correct' : 'incorrect';
  }

  isQuizSelected(question: BrainQuestItem, option: string): boolean {
    const key = question.id ?? question.question;
    return this.quizAnswers[key] === option;
  }

  quizState(question: BrainQuestItem, option: string): string | null {
    const key = question.id ?? question.question;
    if (!this.quizFeedback[key]) {
      return null;
    }
    if (option === question.answer) {
      return 'correct';
    }
    if (this.quizAnswers[key] === option) {
      return 'incorrect';
    }
    return null;
  }

  trackByIndex(index: number): number {
    return index;
  }

  wordKey(word: WordExploreItem): string {
    return word.id ?? word.word;
  }
}
