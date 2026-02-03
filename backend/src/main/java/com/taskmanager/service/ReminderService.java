package com.taskmanager.service;

import com.taskmanager.entity.Task;
import com.taskmanager.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReminderService {

    private final TaskRepository taskRepository;
    private final EmailService emailService;

    @Scheduled(fixedRate = 30000)
    @Transactional
    public void checkReminders() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime start = now.minusMinutes(1);
        LocalDateTime end = now.plusMinutes(1);

        List<Task> tasksForReminder = taskRepository.findTasksForReminder(start, end);

        for (Task task : tasksForReminder) {
            sendReminder(task);
        }
    }

    private void sendReminder(Task task) {
        try {
            boolean sent = emailService.sendTaskReminder(task.getUser(), task);
            if (sent) {
                task.setReminderSent(true);
                taskRepository.save(task);
                log.info("Reminder email sent for task '{}' to user {}",
                        task.getTaskName(),
                        task.getUser().getUsername());
            }
        } catch (Exception ex) {
            log.error("Failed to send reminder email for task {}: {}", task.getId(), ex.getMessage());
        }
    }
}
