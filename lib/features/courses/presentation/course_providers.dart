import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../domain/course.dart';
import '../domain/course_repository.dart';

final courseRepositoryProvider = Provider<CourseRepository>((ref) {
  throw UnimplementedError('Initialize courseRepositoryProvider in ProviderScope');
});

final publishedCoursesProvider = FutureProvider<List<Course>>((ref) {
  return ref.watch(courseRepositoryProvider).publishedCourses();
});

final coursesProvider = publishedCoursesProvider;

final courseDetailProvider =
    FutureProvider.family<Course, String>((ref, courseId) {
  return ref.watch(courseRepositoryProvider).courseDetail(courseId);
});

final enrollInCourseProvider =
    FutureProvider.family<void, String>((ref, batchId) {
  return ref.watch(courseRepositoryProvider).enroll(batchId: batchId);
});

final dropCourseProvider =
    FutureProvider.family<void, String>((ref, batchId) {
  return ref.watch(courseRepositoryProvider).drop(batchId: batchId);
});
