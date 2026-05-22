import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import {
  BrainQuestItem,
  StoryAdventure,
  StoryDetail,
  StoryListItem,
  StoryStatus,
  WordExploreItem,
} from '../models/story.model';

const API = 'https://mxpertztestapi.onrender.com/api/sciencefiction';

@Injectable({ providedIn: 'root' })
export class StoryService {
  constructor(private http: HttpClient) {}

  getStories(): Observable<StoryListItem[]> {
    return this.http.get<unknown>(API).pipe(
      map((res) => this.getList(res).map((item) => this.toListItem(item)))
    );
  }

  getStoryById(id: string): Observable<StoryDetail> {
    return this.http.get<unknown>(`${API}/${id}`).pipe(
      map((res) => this.toDetail(this.getOne(res)))
    );
  }

  private getList(res: unknown): Record<string, unknown>[] {
    if (Array.isArray(res)) return res;
    const data = res as Record<string, unknown>;
    if (Array.isArray(data['stories'])) return data['stories'];
    if (Array.isArray(data['value'])) return data['value'];
    return [];
  }

  private getOne(res: unknown): Record<string, unknown> {
    if (Array.isArray(res)) return res[0] ?? {};
    const data = res as Record<string, unknown>;
    if (Array.isArray(data['stories']) && data['stories'].length) {
      return data['stories'][0];
    }
    return (res ?? {}) as Record<string, unknown>;
  }

  private val(item: Record<string, unknown>, ...keys: string[]): unknown {
    for (const key of keys) {
      if (item[key] != null && item[key] !== '') return item[key];
    }
    return undefined;
  }

  private toListItem(raw: Record<string, unknown>): StoryListItem {
    const status = String(this.val(raw, 'Status', 'status') ?? 'New');
    return {
      id: String(this.val(raw, '_id', 'id') ?? ''),
      title: String(this.val(raw, 'Title', 'title') ?? 'Untitled'),
      image: this.toArray(this.val(raw, 'Image', 'image')),
      status: this.toStatus(status),
    };
  }

  private toDetail(raw: Record<string, unknown>): StoryDetail {
    return {
      ...this.toListItem(raw),
      storyAdventure: this.toAdventure(
        this.val(raw, 'Storyadvenure', 'storyAdventure', 'StoryAdventure')
      ),
      wordExplore: this.toWords(this.val(raw, 'Wordexplore', 'wordExplore')),
      brainQuest: this.toQuiz(this.val(raw, 'Brainquest', 'brainQuest')),
    };
  }

  private toStatus(status: string): StoryStatus {
    const s = status.trim().toLowerCase();
    if (s === 'published' || s === 'draft') return 'New';
    if (s === 'in progress' || s === 'in-progress') return 'In Progress';
    if (s === 'completed') return 'Completed';
    return status || 'New';
  }

  private toArray(value: unknown): string[] {
    if (!value) return [];
    return Array.isArray(value) ? value.map(String) : [String(value)];
  }

  private toCsv(value: unknown): string[] {
    if (Array.isArray(value)) return value.map((v) => String(v).trim()).filter(Boolean);
    if (typeof value === 'string') return value.split(',').map((v) => v.trim()).filter(Boolean);
    return [];
  }

  private toOptions(value: unknown): string[] {
    if (Array.isArray(value)) return value.map(String);
    if (typeof value !== 'string') return [];
    return value.split(/(?<=[a-z])\s+(?=[A-Z])/).map((v) => v.trim()).filter(Boolean);
  }

  private toAdventure(data: unknown): StoryAdventure {
    const raw = (data ?? {}) as Record<string, unknown>;
    const sections = Array.isArray(raw['content']) ? raw['content'] : [];
    return {
      title: String(this.val(raw, 'Storytitle', 'title') ?? ''),
      content: sections.map((section) => {
        const item = section as Record<string, unknown>;
        return {
          id: String(this.val(item, '_id', 'id') ?? ''),
          paragraphs: this.toArray(this.val(item, 'Paragraph', 'paragraphs')),
          images: this.toArray(this.val(item, 'Storyimage', 'images')),
        };
      }),
    };
  }

  private toWords(data: unknown): WordExploreItem[] {
    if (!Array.isArray(data)) return [];
    return data.map((entry) => {
      const item = entry as Record<string, unknown>;
      return {
        id: String(this.val(item, '_id', 'id') ?? ''),
        word: String(this.val(item, 'Storytitle', 'word') ?? ''),
        noun: String(this.val(item, 'Noun', 'noun', 'Storytitle') ?? ''),
        meaning: String(this.val(item, 'Storyttext', 'meaning') ?? ''),
        description: String(this.val(item, 'Storyitext', 'description') ?? ''),
        image: String(this.val(item, 'Storyimage', 'image') ?? ''),
        synonyms: this.toCsv(this.val(item, 'Synonyms', 'synonyms')),
        antonyms: this.toCsv(this.val(item, 'Antonyms', 'antonyms')),
      };
    });
  }

  private toQuiz(data: unknown): BrainQuestItem[] {
    if (!Array.isArray(data)) return [];
    return data.map((entry) => {
      const item = entry as Record<string, unknown>;
      return {
        id: String(this.val(item, '_id', 'id') ?? ''),
        question: String(this.val(item, 'Question', 'question') ?? ''),
        options: this.toOptions(this.val(item, 'Option', 'options')),
        answer: String(this.val(item, 'Answer', 'answer') ?? ''),
      };
    });
  }
}
