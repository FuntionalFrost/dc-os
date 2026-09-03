<script lang="ts">
	import type { Question } from '$lib/data/comptia-questions';
	import { compTiaQuestions } from '$lib/data/comptia-questions';
	import {
		Award,
		Bookmark,
		BookmarkCheck,
		BookOpen,
		BrainCircuit,
		CircleCheck,
		CircleX,
		ListChecks,
		RefreshCw,
		Timer
	} from '@lucide/svelte';
	import { onDestroy } from 'svelte';

	// System States (Svelte 5 Runes)
	let quizMode = $state<'STUDY' | 'EXAM'>('STUDY');
	let selectedCategory = $state<string>('All');

	let currentQuestionIndex = $state(0);
	let userAnswers = $state<Record<string, number>>({}); // Map of question.id -> chosen option index
	let flaggedQuestions = $state<Record<string, boolean>>({}); // Map of question.id -> is flagged
	let checkedAnswers = $state<Record<string, boolean>>({}); // In study mode, track which questions have been checked/submitted

	let quizCompleted = $state(false);

	// Timer States (Type-safe for browser runtime)
	let timeRemaining = $state(900); // 15 minutes for Exam Mode
	let timerInterval: ReturnType<typeof setInterval> | null = null;

	// Svelte 5 pure derived filters
	let filteredQuestions = $derived(
		selectedCategory === 'All'
			? compTiaQuestions
			: compTiaQuestions.filter((q) => q.category === selectedCategory)
	);

	let activeQuestion: Question = $derived(
		filteredQuestions[currentQuestionIndex] || filteredQuestions[0] || compTiaQuestions[0]
	);

	let activeUserSelection = $derived(userAnswers[activeQuestion.id] ?? null);
	let isCurrentQuestionFlagged = $derived(!!flaggedQuestions[activeQuestion.id]);
	let isCurrentQuestionChecked = $derived(!!checkedAnswers[activeQuestion.id]);

	// Exam Score calculation
	let finalScore = $derived.by(() => {
		let matches = 0;
		filteredQuestions.forEach((q) => {
			if (userAnswers[q.id] === q.correctAnswer) {
				matches++;
			}
		});
		return matches;
	});

	let scorePercentage = $derived.by(() => {
		if (filteredQuestions.length === 0) return 0;
		return Math.round((finalScore / filteredQuestions.length) * 100);
	});

	// Timer Lifecycle management
	function startTimer() {
		stopTimer();
		timeRemaining = 900;
		timerInterval = setInterval(() => {
			if (timeRemaining > 0) {
				timeRemaining--;
			} else {
				stopTimer();
				submitFinalExam();
			}
		}, 1000);
	}

	function stopTimer() {
		if (timerInterval) {
			clearInterval(timerInterval);
			timerInterval = null;
		}
	}

	// Handle mode transitions
	$effect(() => {
		if (quizMode === 'EXAM' && !quizCompleted) {
			startTimer();
		} else {
			stopTimer();
		}
	});

	onDestroy(() => {
		stopTimer();
	});

	// Actions
	function selectOption(index: number) {
		if (quizCompleted) return;
		if (quizMode === 'STUDY' && isCurrentQuestionChecked) return; // Lock options after submitting in Study Mode
		userAnswers[activeQuestion.id] = index;
	}

	function toggleFlag() {
		flaggedQuestions[activeQuestion.id] = !flaggedQuestions[activeQuestion.id];
	}

	function checkAnswerInStudyMode() {
		if (activeUserSelection === null) return;
		checkedAnswers[activeQuestion.id] = true;
	}

	function nextQuestion() {
		if (currentQuestionIndex + 1 < filteredQuestions.length) {
			currentQuestionIndex++;
		}
	}

	function prevQuestion() {
		if (currentQuestionIndex > 0) {
			currentQuestionIndex--;
		}
	}

	function submitFinalExam() {
		stopTimer();
		quizCompleted = true;
	}

	function resetQuiz() {
		userAnswers = {};
		flaggedQuestions = {};
		checkedAnswers = {};
		currentQuestionIndex = 0;
		quizCompleted = false;
		if (quizMode === 'EXAM') {
			startTimer();
		}
	}

	// Formatting helpers
	let formattedTime = $derived.by(() => {
		const mins = Math.floor(timeRemaining / 60);
		const secs = timeRemaining % 60;
		return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
	});
</script>

<svelte:head>
	<title>Exam Simulator — RACK_COMMAND // DC-OS</title>
	<meta
		name="description"
		content="CompTIA A+, Network+, Server+, and Linux+ practice exam simulator with study mode and 15-minute timed exam mode."
	/>
</svelte:head>

<div class="space-y-6 font-mono">
	<div
		class="flex flex-col items-start justify-between gap-3 border-b border-base-200 pb-3 sm:flex-row sm:items-center"
	>
		<div>
			<h1 class="text-xl font-black tracking-wider text-primary uppercase">
				🧠 EXAM_SIM // COMPTIA_TRAINING
			</h1>
			<p class="text-[11px] text-neutral-content">
				Cert prep for CompTIA A+, Network+, Server+, and Linux+.
			</p>
		</div>

		<div
			class="flex justify-center gap-1.5 self-stretch rounded-lg border border-base-300 bg-base-200 p-0.5 sm:self-auto"
		>
			<button
				onclick={() => {
					quizMode = 'STUDY';
					resetQuiz();
				}}
				class="btn h-7 rounded-md px-3 text-[10px] font-bold transition-all {quizMode === 'STUDY'
					? 'text-primary-content btn-primary'
					: 'btn-ghost'}"
			>
				<BookOpen class="mr-1 h-3.5 w-3.5" /> STUDY
			</button>
			<button
				onclick={() => {
					quizMode = 'EXAM';
					resetQuiz();
				}}
				class="btn h-7 rounded-md px-3 text-[10px] font-bold transition-all {quizMode === 'EXAM'
					? 'text-primary-content btn-primary'
					: 'btn-ghost'}"
			>
				<Timer class="mr-1 h-3.5 w-3.5" /> EXAM
			</button>
		</div>
	</div>

	{#if !quizCompleted && quizMode === 'STUDY'}
		<div
			class="flex flex-wrap items-center gap-1.5 rounded-xl border border-base-200 bg-base-100 p-2.5 text-xs"
		>
			<span class="px-1 text-[10px] font-bold text-neutral-content/60 uppercase">Scope:</span>
			{#each ['All', 'Hardware', 'Linux', 'Networking', 'Fiber'] as category (category)}
				<button
					class="btn rounded-md transition-all btn-xs {selectedCategory === category
						? 'text-accent-content btn-accent'
						: 'border border-base-300 bg-base-200 btn-ghost'}"
					onclick={() => {
						selectedCategory = category;
						resetQuiz();
					}}
				>
					{category}
				</button>
			{/each}
		</div>
	{/if}

	<div class="grid grid-cols-1 items-start gap-4 lg:grid-cols-12">
		<div class="space-y-4 lg:col-span-8">
			{#if quizCompleted}
				<div class="card border border-base-200 bg-base-100 py-8 text-center shadow-md">
					<div class="card-body items-center p-6">
						<Award class="mb-2 h-12 w-12 text-primary" />
						<h2 class="text-xl font-black tracking-widest text-primary uppercase">
							SESSION COMPLETED
						</h2>

						<div class="stats my-4 w-full max-w-xs border border-base-300 bg-base-200 shadow">
							<div class="stat p-4">
								<div class="stat-title text-[10px] tracking-wider uppercase">Accumulated Score</div>
								<div class="stat-value text-2xl text-primary">
									{finalScore} / {filteredQuestions.length}
								</div>
								<div class="stat-desc mt-1 text-[9px] font-bold">
									{#if scorePercentage >= 80}
										<span class="text-success">🟩 PASS BOUND ACCREDITED ({scorePercentage}%)</span>
									{:else}
										<span class="text-error">🟥 RETRY RECOMMENDED ({scorePercentage}%)</span>
									{/if}
								</div>
							</div>
						</div>

						{#if quizMode === 'EXAM'}
							<div
								class="mt-2 max-h-72 w-full space-y-2 overflow-y-auto border-t border-base-200 pt-4 text-left"
							>
								<h3 class="text-xs font-bold text-neutral-content uppercase">
									Session Review Panel:
								</h3>
								{#each filteredQuestions as q, idx (q.id)}
									{@const answeredIdx = userAnswers[q.id]}
									{@const isCorrect = answeredIdx === q.correctAnswer}
									<div
										class="flex items-center justify-between gap-2 rounded border border-base-300 bg-base-200 p-2 text-xs"
									>
										<div>
											<p class="max-w-md truncate font-bold text-base-content">
												Q{idx + 1}: {q.scenario}
											</p>
											<p class="mt-0.5 text-[10px] text-neutral-content">
												Your answer: <span
													class={isCorrect ? 'font-bold text-success' : 'font-bold text-error'}
												>
													{answeredIdx !== undefined ? q.options[answeredIdx] : 'Unanswered'}
												</span>
											</p>
										</div>
										<div>
											{#if isCorrect}
												<span class="badge badge-sm text-[10px] font-bold badge-success"
													>CORRECT</span
												>
											{:else}
												<span class="badge badge-sm text-[10px] font-bold badge-error">MISS</span>
											{/if}
										</div>
									</div>
								{/each}
							</div>
						{/if}

						<button
							class="btn mt-6 font-mono tracking-widest btn-primary btn-sm"
							onclick={resetQuiz}
						>
							<RefreshCw class="mr-1 h-4 w-4" /> REBOOT EVALUATION ENGINE
						</button>
					</div>
				</div>
			{:else}
				<div class="card border border-base-200 bg-base-100 shadow-md">
					<div class="card-body p-4">
						<div class="mb-4 flex items-center justify-between border-b border-base-200 pb-2">
							<div class="flex items-center gap-2">
								<span class="badge badge-sm text-[10px] font-black uppercase badge-accent"
									>{activeQuestion.category}</span
								>
								{#if quizMode === 'EXAM'}
									<span
										class="badge flex items-center gap-1 badge-outline badge-sm text-[10px] font-bold"
									>
										<Timer class="h-3 w-3" />
										{formattedTime}
									</span>
								{/if}
							</div>

							<button
								onclick={toggleFlag}
								class="btn gap-1 btn-ghost font-mono text-[10px] btn-xs"
								aria-label="Flag Question"
							>
								{#if isCurrentQuestionFlagged}
									<BookmarkCheck class="h-4 w-4 text-warning" />
									<span class="font-bold text-warning">FLAGGED</span>
								{:else}
									<Bookmark class="h-4 w-4 opacity-55" />
									<span>FLAG</span>
								{/if}
							</button>
						</div>

						<p class="mb-4 text-xs leading-relaxed font-bold text-base-content md:text-sm">
							{activeQuestion.scenario}
						</p>

						<div class="space-y-2">
							{#each activeQuestion.options as option, idx (idx)}
								{@const isSelected = activeUserSelection === idx}
								{@const isCorrectAns = idx === activeQuestion.correctAnswer}
								{@const showCheckedCorrect = isCurrentQuestionChecked && isCorrectAns}
								{@const showCheckedIncorrect =
									isCurrentQuestionChecked && isSelected && !isCorrectAns}

								<button
									class="flex w-full items-center justify-between rounded-lg border p-3 text-left font-mono text-xs transition-all
                  {isSelected
										? 'border-primary bg-primary/10 font-bold text-primary'
										: 'border-base-300 bg-base-200'} 
                  {showCheckedCorrect ? 'border-success bg-success/10 text-success' : ''}
                  {showCheckedIncorrect ? 'border-error bg-error/10 text-error' : ''}"
									onclick={() => selectOption(idx)}
									disabled={quizMode === 'STUDY' && isCurrentQuestionChecked}
								>
									<span>{option}</span>
									{#if showCheckedCorrect}
										<CircleCheck class="ml-2 h-4 w-4 shrink-0 text-success" />
									{:else if showCheckedIncorrect}
										<CircleX class="ml-2 h-4 w-4 shrink-0 text-error" />
									{/if}
								</button>
							{/each}
						</div>

						<div class="mt-6 flex items-center justify-between gap-2 border-t border-base-200 pt-3">
							<div class="flex gap-1.5">
								<button
									class="btn border-base-300 btn-outline font-mono btn-xs"
									onclick={prevQuestion}
									disabled={currentQuestionIndex === 0}
								>
									&lt; BACK
								</button>
								<button
									class="btn border-base-300 btn-outline font-mono btn-xs"
									onclick={nextQuestion}
									disabled={currentQuestionIndex + 1 === filteredQuestions.length}
								>
									NEXT &gt;
								</button>
							</div>

							<div>
								{#if quizMode === 'STUDY'}
									{#if !isCurrentQuestionChecked}
										<button
											class="btn tracking-wider btn-accent btn-xs"
											onclick={checkAnswerInStudyMode}
											disabled={activeUserSelection === null}
										>
											CHECK ANSWER
										</button>
									{:else}
										<button
											class="btn tracking-wider btn-neutral btn-xs"
											onclick={nextQuestion}
											disabled={currentQuestionIndex + 1 === filteredQuestions.length}
										>
											CONTINUE
										</button>
									{/if}
								{:else if quizMode === 'EXAM' && currentQuestionIndex + 1 === filteredQuestions.length}
									<button class="btn tracking-wider btn-success btn-xs" onclick={submitFinalExam}>
										FINISH EXAM
									</button>
								{/if}
							</div>
						</div>
					</div>
				</div>

				{#if quizMode === 'STUDY' && isCurrentQuestionChecked}
					<div
						class="alert flex items-start gap-2 rounded-xl border-info/15 bg-info/5 p-3 font-mono text-xs alert-info text-info"
					>
						<BrainCircuit class="mt-0.5 h-5 w-5 shrink-0" />
						<div>
							<h4 class="text-[10px] font-bold tracking-wider text-accent uppercase">
								Analysis & Context
							</h4>
							<p class="mt-1 text-[11px] leading-relaxed text-base-content/95">
								{activeQuestion.explanation}
							</p>
						</div>
					</div>
				{/if}
			{/if}
		</div>

		<div class="space-y-4 lg:col-span-4">
			<div class="card border border-base-200 bg-base-100 shadow-md">
				<div class="card-body p-4">
					<h2
						class="card-title flex items-center gap-1.5 text-xs font-black text-neutral-content/70 uppercase"
					>
						<ListChecks class="h-4 w-4" /> Exam Monitor Board
					</h2>

					<div class="my-3 grid grid-cols-5 gap-1.5">
						{#each filteredQuestions as q, idx (q.id)}
							{@const isAnswered = userAnswers[q.id] !== undefined}
							{@const isFlagged = flaggedQuestions[q.id]}
							{@const isActive = currentQuestionIndex === idx}
							{@const isChecked = checkedAnswers[q.id]}
							{@const isCorrect = userAnswers[q.id] === q.correctAnswer}

							<button
								onclick={() => {
									currentQuestionIndex = idx;
								}}
								class="btn h-8 rounded border p-0 font-mono text-[10px] font-bold transition-all btn-xs
                {isActive ? 'ring-2 ring-primary ring-offset-1' : ''}
                {quizMode === 'STUDY' && isChecked
									? isCorrect
										? 'border-success bg-success/20 text-success'
										: 'border-error bg-error/20 text-error'
									: ''}
                {quizMode === 'EXAM' && isAnswered && !isFlagged
									? 'border-primary bg-primary/20 text-primary'
									: ''}
                {isFlagged ? 'border-warning bg-warning/20 text-warning' : ''}
                {!isAnswered && !isFlagged && !isActive ? 'border-base-300 bg-base-200' : ''}"
							>
								{idx + 1}
							</button>
						{/each}
					</div>

					<div
						class="space-y-1.5 border-t border-base-200 pt-2.5 text-[10px] font-bold text-neutral-content"
					>
						<div class="flex justify-between">
							<span>ACTIVE CATEGORY:</span>
							<span class="text-primary uppercase">{selectedCategory}</span>
						</div>
						<div class="flex justify-between">
							<span>QUESTIONS:</span>
							<span>{filteredQuestions.length} Total</span>
						</div>
						<div class="flex justify-between">
							<span>BOOKMARKED / FLAGGED:</span>
							<span class="text-warning"
								>{Object.values(flaggedQuestions).filter(Boolean).length}</span
							>
						</div>
						<div class="flex justify-between">
							<span>UNANSWERED:</span>
							<span>{filteredQuestions.length - Object.keys(userAnswers).length} remaining</span>
						</div>
					</div>

					{#if quizMode === 'EXAM' && !quizCompleted}
						<button
							onclick={submitFinalExam}
							class="btn mt-3 w-full btn-outline font-mono text-xs uppercase btn-error btn-sm"
						>
							SUBMIT COMPLETED EXAM
						</button>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>
