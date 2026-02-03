package com.taskmanager.service;

import com.taskmanager.entity.Task;
import com.taskmanager.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReminderService {

    private final TaskRepository taskRepository;

    @Scheduled(fixedRate = 60000)
    public void checkReminders() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime end = now.plusMinutes(5);

        List<Task> tasksForReminder = taskRepository.findTasksForReminder(now, end);

        for (Task task : tasksForReminder) {
            sendReminder(task);
        }
    }

    private void sendReminder(Task task) {
        log.info("Reminder: Task '{}' is due on {} for user {}",
                task.getTaskName(),
                task.getDueDate(),
                task.getUser().getUsername());
    }
}