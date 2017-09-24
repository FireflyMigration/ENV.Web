using System;
using Firefly.Box;
using Firefly.Box.Flow;

namespace ENV.Web
{
    public class MockFlow
    {
        public void Add(Action action, Func<bool> condition, Direction direction)
        {
        }
        public void Add(Action action, Direction direction)
        {
        }
        public void Add(Action action, FlowMode flowMode, Direction direction)
        {
        }
        public void Add<taskType>(CachedTask<taskType> cachedTask, Action runTask) where taskType : class
        {
        }
        public void Add(Action action, Func<bool> condition, FlowMode flowMode)
        {
        }
        public void Add(Action action, Func<bool> condition)
        {
        }
        public void Add(Action action, Func<bool> condition, FlowMode flowMode, Direction direction)
        {
        }
        public void AddCallByIndex(Func<Number> programIndex, Action<ProgramCollection.Runnable> action, Func<bool> condition, FlowMode flowMode, Direction direction)
        {
        }
        public void AddCallByIndex(Func<Number> programIndex, Action<ProgramCollection.Runnable> action, Func<bool> condition, FlowMode flowMode)
        {
        }
        public void AddCallByIndex(Func<Number> programIndex, Action<ProgramCollection.Runnable> action, Func<bool> condition)
        {
        }
        public void AddCallByIndex(Func<Number> programIndex, Action<ProgramCollection.Runnable> action)
        {
        }
        public void AddCallByIndex(Func<Number> programIndex, Action<ProgramCollection.Runnable> action, Func<bool> condition, Direction direction)
        {
        }
        public void AddCallByIndex(Func<Number> programIndex, Action<ProgramCollection.Runnable> action, Direction direction)
        {
        }
        public void AddCallByIndex(Func<Number> programIndex, Action<ProgramCollection.Runnable> action, FlowMode flowMode, Direction direction)
        {
        }
        public void AddCallByIndex(Func<Number> programIndex, Action<ProgramCollection.Runnable> action, FlowMode flowMode)
        {
        }
        public void AddCallByPublicName(Func<Text> programPublicName, Action<ProgramCollection.Runnable> action, Func<bool> condition, FlowMode flowMode, Direction direction)
        {
        }
        public void AddCallByPublicName(Func<Text> programPublicName, Action<ProgramCollection.Runnable> action, Func<bool> condition, FlowMode flowMode)
        {
        }
        public void AddCallByPublicName(Func<Text> programPublicName, Action<ProgramCollection.Runnable> action, Func<bool> condition)
        {
        }
        public void AddCallByPublicName(Func<Text> programPublicName, Action<ProgramCollection.Runnable> action)
        {
        }
        public void AddCallByPublicName(Func<Text> programPublicName, Action<ProgramCollection.Runnable> action, Func<bool> condition, Direction direction)
        {
        }
        public void AddCallByPublicName(Func<Text> programPublicName, Action<ProgramCollection.Runnable> action, Direction direction)
        {
        }
        public void AddCallByPublicName(Func<Text> programPublicName, Action<ProgramCollection.Runnable> action, FlowMode flowMode, Direction direction)
        {
        }
        public void AddCallByPublicName(Func<Text> programPublicName, Action<ProgramCollection.Runnable> action, FlowMode flowMode)
        {
        }
        public void Add(Action action)
        {
        }
        public void Add(Action action, FlowMode flowMode)
        {
        }
        public void Add<controller>(CachedTask<controller> cachedTask, Action runTask, Func<bool> condition, FlowMode flowMode, Direction direction) where controller : class
        {
        }
        public void Add<controller>(CachedTask<controller> cachedTask, Action runTask, Func<bool> condition, Direction direction) where controller : class
        {
        }
        public void Add<controller>(CachedTask<controller> cachedTask, Action runTask, Func<bool> condition) where controller : class
        {
        }
        public void Add<controller>(CachedTask<controller> cachedTask, Action runTask, FlowMode flowMode, Direction direction) where controller : class
        {
        }
        public void Add<controller>(CachedTask<controller> cachedTask, Action runTask, Direction direction) where controller : class
        {
        }
        public void Add<controller>(CachedTask<controller> cachedTask, Action runTask, FlowMode flowMode) where controller : class
        {
        }
        public void Add<controller>(Action<controller> runTask, Func<bool> condition, FlowMode flowMode, Direction direction) where controller : class
        {
        }
        public void Add<controller>(Action<controller> runTask, Func<bool> condition, FlowMode flowModel) where controller : class
        {
        }
        public void Add<controller>(Action<controller> runTask) where controller : class
        {
        }
        public void Add<controller>(Action<controller> runTask, Func<bool> condition, Direction direction) where controller : class
        {
        }
        public void Add<controller>(Action<controller> runTask, Func<bool> condition) where controller : class
        {
        }
        public void Add<controller>(Action<controller> runTask, FlowMode flowMode, Direction direction) where controller : class
        {
        }
        public void Add<controller>(Action<controller> runTask, Direction direction) where controller : class
        {
        }
        public void Add<controller>(Action<controller> runTask, FlowMode flowMode) where controller : class
        {
        }
        public void Add<taskType>(CachedTask<taskType> cachedTask, Action runTask, Func<bool> condition, FlowMode flowMode) where taskType : class
        {
        }
        public void EndBlock()
        {
        }
        public void RunExpandEventOfParkedColumnEvenIfRaisedByOtherControls(Action runExpandEvent)
        {
        }
        public void StartBlock()
        {
        }
        public void StartBlock(FlowMode flowMode)
        {
        }
        public void StartBlock(Direction direction)
        {
        }
        public void StartBlock(FlowMode flowMode, Direction direction)
        {
        }
        public void StartBlock(Func<bool> condition)
        {
        }
        public void StartBlock(Func<bool> condition, Direction direction)
        {
        }
        public void StartBlock(Func<bool> condition, FlowMode flowMode)
        {
        }
        public void StartBlock(Func<bool> condition, FlowMode flowMode, Direction direction)
        {
        }
        public void StartBlockElse(Func<bool> condition)
        {
        }
        public void StartBlockElse()
        {
        }
        
    }
}
